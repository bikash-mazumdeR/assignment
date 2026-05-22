import dotenv from 'dotenv';
import path from 'path';

const ENV = process.env.NODE_ENV || 'qa';
const envPath = path.resolve(__dirname, `env/.env.${ENV}`);

// Load from .env file for local development
dotenv.config({ path: envPath });

/**
 * Helper to ensure a required environment variable is present
 */
const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (value === undefined) {
    // Only throw if we are in CI, or keep it optional for local flexibility
    if (process.env.CI) {
      throw new Error(`Environment variable ${name} is missing!`);
    }
    return '';
  }
  return value;
};

export const env = {
  NODE_ENV: ENV,
  BASE_URL: getEnvVar('BASE_URL'),
  API_URL: getEnvVar('API_URL'),
  API_USER: getEnvVar('API_USER'),
  API_PASS: getEnvVar('API_PASS'),
  UI_USER: getEnvVar('UI_USER'),
  UI_PASS: getEnvVar('UI_PASS'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
