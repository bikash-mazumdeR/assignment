import { test, expect } from '@fixtures/ui.fixtures';

test.describe('Checkout Module @regression @ui', () => {
  test.beforeEach(async ({ page, inventoryPage, cartPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('Missing required fields validation', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation('', '', '');
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('Successful information submission', async ({ checkoutPage, page }) => {
    await checkoutPage.fillInformation('John', 'Doe', '12345');
    await expect(page).toHaveURL(/checkout-step-two.html/);
  });
});
