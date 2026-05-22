import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { env } from '@config/env.config';
import * as path from 'path';
import * as fs from 'fs';

export const STORAGE_STATE = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.open();
  await loginPage.login(env.UI_USER, env.UI_PASS);
  
  // Wait for navigation or a specific element that confirms login
  await expect(page).toHaveURL(/inventory.html/);
  
  // End of authentication steps.
  await page.context().storageState({ path: STORAGE_STATE });
});

setup('authenticate API', async ({ request }) => {
  const response = await request.post(`${env.API_URL}/auth`, {
    data: {
      username: env.API_USER,
      password: env.API_PASS,
    },
  });
  
  expect(response.status()).toBe(200);
  const body = await response.json();
  const token = body.token;
  expect(token).toBeDefined();

  const apiTokenPath = path.join(__dirname, '../../playwright/.auth/api-token.json');
  fs.mkdirSync(path.dirname(apiTokenPath), { recursive: true });
  fs.writeFileSync(apiTokenPath, JSON.stringify({ token }, null, 2));
});
