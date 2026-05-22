import { test, expect } from '@fixtures/ui.fixtures';

test.describe('Shopping Cart Module @regression @ui', () => {
  test.beforeEach(async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
  });

  test('Verify item in cart', async ({ cartPage }) => {
    expect(await cartPage.getCartItemsCount()).toBe(1);
  });

  test('Remove item from cart page', async ({ cartPage }) => {
    await cartPage.removeItem('Sauce Labs Backpack');
    expect(await cartPage.getCartItemsCount()).toBe(0);
  });
});
