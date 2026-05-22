import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from './Logger';
import { redact, redactUrl } from './RedactionHelper';

export class RequestWrapper {
  constructor(private readonly request: APIRequestContext) {}

  async post<T extends Record<string, unknown>>(
    url: string,
    data?: T,
    headers?: Record<string, string>,
    options?: { maxRetries?: number }
  ): Promise<APIResponse> {
    logger.info(`API POST Request to: ${redactUrl(url)}`);
    if (data) logger.debug(`Payload: ${JSON.stringify(redact(data))}`);
    
    return this.executeWithRetry(
      async () => {
        const response = await this.request.post(url, {
          data,
          headers,
        });
        await this.logResponse(response);
        return response;
      },
      options?.maxRetries
    );
  }

  async get(
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>,
    options?: { maxRetries?: number }
  ): Promise<APIResponse> {
    logger.info(`API GET Request to: ${redactUrl(url)}`);
    
    return this.executeWithRetry(
      async () => {
        const response = await this.request.get(url, {
          params,
          headers,
        });
        await this.logResponse(response);
        return response;
      },
      options?.maxRetries
    );
  }

  async put<T extends Record<string, unknown>>(
    url: string,
    data: T,
    headers?: Record<string, string>,
    options?: { maxRetries?: number }
  ): Promise<APIResponse> {
    logger.info(`API PUT Request to: ${redactUrl(url)}`);
    if (data) logger.debug(`Payload: ${JSON.stringify(redact(data))}`);
    
    return this.executeWithRetry(
      async () => {
        const response = await this.request.put(url, {
          data,
          headers,
        });
        await this.logResponse(response);
        return response;
      },
      options?.maxRetries
    );
  }

  async delete(
    url: string,
    headers?: Record<string, string>,
    options?: { maxRetries?: number }
  ): Promise<APIResponse> {
    logger.info(`API DELETE Request to: ${redactUrl(url)}`);
    
    return this.executeWithRetry(
      async () => {
        const response = await this.request.delete(url, {
          headers,
        });
        await this.logResponse(response);
        return response;
      },
      options?.maxRetries
    );
  }

  private async executeWithRetry(
    operation: () => Promise<APIResponse>,
    maxRetries = 3,
    delayMs = 1000
  ): Promise<APIResponse> {
    let lastResponse: APIResponse | undefined;
    const attempts = Math.max(1, maxRetries);
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const response = await operation();
        lastResponse = response;
        const status = response.status();
        
        // Only retry on server errors (5xx) or transient statuses.
        // Client errors (4xx) are expected test outcomes, so we don't retry.
        if (status < 500) {
          return response;
        }
        
        if (attempt < attempts) {
          logger.warn(`API Attempt ${attempt} returned status ${status}. Retrying in ${delayMs}ms...`);
        }
      } catch (error) {
        if (attempt === attempts) {
          logger.error(`API Attempt ${attempt} failed with error: ${error}. Max retries reached.`);
          throw error;
        }
        logger.warn(`API Attempt ${attempt} failed with error: ${error}. Retrying in ${delayMs}ms...`);
      }
      if (attempt < attempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    return lastResponse!;
  }

  private async logResponse(response: APIResponse) {
    const status = response.status();
    logger.info(`API Response Status: ${status}`);
    if (status >= 400) {
      const body = await response.text();
      try {
        const jsonBody = JSON.parse(body);
        logger.error(`API Error Response: ${JSON.stringify(redact(jsonBody))}`);
      } catch {
        logger.error(`API Error Response: ${body}`);
      }
    }
  }
}
