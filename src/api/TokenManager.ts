import { RequestWrapper } from '@core/RequestWrapper';
import { env } from '@config/env.config';
import { AuthResponseSchema } from '@schemas/booking.schemas';
import { logger } from '@core/Logger';
import * as fs from 'fs';
import * as path from 'path';

export class TokenManager {
  private static token: string | null = null;
  private static tokenTimestamp: number = 0;
  private static readonly TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes

  static async getToken(request: RequestWrapper): Promise<string> {
    const apiTokenPath = path.resolve(__dirname, '../../playwright/.auth/api-token.json');
    if (fs.existsSync(apiTokenPath)) {
      try {
        const fileContent = fs.readFileSync(apiTokenPath, 'utf8');
        const tokenData = JSON.parse(fileContent);
        if (tokenData && tokenData.token) {
          logger.info('Using token from playwright/.auth/api-token.json');
          return tokenData.token;
        }
      } catch (err) {
        logger.error(`Error reading API token file: ${err}`);
      }
    }

    if (this.token && !this.isTokenExpired()) {
      return this.token;
    }

    logger.info('Generating new auth token...');
    const response = await request.post(`${env.API_URL}/auth`, {
      username: env.API_USER,
      password: env.API_PASS,
    });

    const body = await response.json();
    const validated = AuthResponseSchema.parse(body);
    this.token = validated.token;
    this.tokenTimestamp = Date.now();
    logger.info('Auth token generated successfully.');
    return this.token;
  }

  private static isTokenExpired(): boolean {
    return Date.now() - this.tokenTimestamp > this.TOKEN_TTL_MS;
  }

  static invalidate(): void {
    this.token = null;
    this.tokenTimestamp = 0;
    logger.info('Auth token invalidated.');
  }
}
