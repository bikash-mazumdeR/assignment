import { test, expect } from '@fixtures/ui.fixtures';
import { env } from '@config/env.config';

test.describe('Login Module @regression @ui', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('Successful login with valid credentials @smoke', async ({ loginPage, page }) => {
    await loginPage.login(env.UI_USER, env.UI_PASS);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Invalid username/password', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('Locked out user validation', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out');
  });

  test('Empty username validation', async ({ loginPage }) => {
    await loginPage.login('', 'secret_sauce');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });
});
