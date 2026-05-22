import dotenv from 'dotenv';
import path from 'path';

const ENV = process.env.NODE_ENV || 'qa';
const envPath = path.resolve(__dirname, `env/.env.${ENV}`);

dotenv.config({ path: envPath });

export const env = {
  NODE_ENV: ENV,
  BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com/',
  API_URL: process.env.API_URL || 'https://restful-booker.herokuapp.com',
  API_USER: process.env.API_USER || 'admin',
  API_PASS: process.env.API_PASS || 'password123',
  UI_USER: process.env.UI_USER || 'standard_user',
  UI_PASS: process.env.UI_PASS || 'secret_sauce',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
