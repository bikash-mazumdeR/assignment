import { test, expect } from '@fixtures/ui.fixtures';
import { env } from '@config/env.config';

// Override storageState for this file — E2E must start from a fresh login
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('End-to-End Flow @e2e @ui', () => {
  test('Complete E2E Purchase Flow: Login → Add to Cart → Checkout @smoke @e2e', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // Step 1: Login
    await loginPage.open();
    await loginPage.login(env.UI_USER, env.UI_PASS);
    await expect(page).toHaveURL(/inventory.html/);

    // Step 2: Add Product to Cart
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');

    // Step 3: Navigate to Cart
    await inventoryPage.goToCart();
    expect(await cartPage.getCartItemsCount()).toBe(1);

    // Step 4: Proceed to Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation('John', 'Doe', '12345');

    // Step 5: Complete Checkout
    await checkoutPage.finishCheckout();
    const message = await checkoutPage.getCompletionMessage();
    expect(message).toBe('Thank you for your order!');
    await expect(page).toHaveURL(/checkout-complete.html/);
  });
});
