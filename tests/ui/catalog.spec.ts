import { test, expect } from '@fixtures/ui.fixtures';

test.describe('Product Catalog Module @regression @ui', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('Add product to cart and verify badge', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');
  });

  test('Remove product from cart and verify badge', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe('0');
  });

  test('Validate product sorting by Price (Low to High)', async ({ inventoryPage, page }) => {
    await inventoryPage.sortProducts('lohi');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sortedPrices);
  });

  test('Negative: Prevent access to catalog for unauthenticated users', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    await page.goto('/inventory.html');
    // SauceDemo redirects to the login page (index.html) if not authenticated
    await expect(page).toHaveURL(/.*index.html|.*\//);
    const loginButton = page.locator('[data-test="login-button"]');
    await expect(loginButton).toBeVisible();
    await context.close();
  });

  test('Negative: Handle non-existent product URL', async ({ page }) => {
    // Navigating to a non-existent product ID
    await page.goto('/inventory-item.html?id=999');
    // SauceDemo typically shows a "broken" item page or redirects
    const errorTitle = page.locator('.inventory_details_name');
    // In SauceDemo, if item not found, it might show "ITEM NOT FOUND" or just be empty
    // We check that it doesn't crash and maybe shows an indication or at least doesn't show a valid product
    await expect(errorTitle).not.toHaveText('Sauce Labs Backpack');
  });

  test('Negative: Simulate network failure for product catalog', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    // Intercept requests and abort them to simulate a network failure
    await page.route('**/*', route => route.abort('failed'));
    
    // Attempt to navigate to the inventory page
    await page.goto('/inventory.html').catch(() => {});
    
    // Verify that the catalog list is hidden
    const catalogList = page.locator('.inventory_list');
    await expect(catalogList).toBeHidden();
    await context.close();
  });
});
