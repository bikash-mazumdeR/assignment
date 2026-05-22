import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { SELECTORS } from '../constants/selectors';

export class InventoryPage extends BasePage {
  private readonly inventoryContainer: Locator;
  private readonly cartBadge: Locator;
  private readonly sortContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator(SELECTORS.INVENTORY.CONTAINER);
    this.cartBadge = page.locator(SELECTORS.INVENTORY.CART_BADGE);
    this.sortContainer = page.locator(SELECTORS.INVENTORY.SORT_CONTAINER);
  }

  async addProductToCart(productName: string) {
    const productLocator = this.page.locator('.inventory_item', { hasText: productName });
    const addButton = productLocator.locator(SELECTORS.INVENTORY.ADD_TO_CART_BUTTON);
    await this.click(addButton, `Add ${productName} to cart`);
  }

  async removeProductFromCart(productName: string) {
    const productLocator = this.page.locator('.inventory_item', { hasText: productName });
    const removeButton = productLocator.locator(SELECTORS.INVENTORY.REMOVE_BUTTON);
    await this.click(removeButton, `Remove ${productName} from cart`);
  }

  async getCartBadgeCount(): Promise<string> {
    if (await this.isVisible(this.cartBadge)) {
      return await this.getText(this.cartBadge);
    }
    return '0';
  }

  async sortProducts(option: string) {
    await this.sortContainer.selectOption(option);
  }

  async goToCart() {
    await this.click(this.page.locator(SELECTORS.INVENTORY.CART_LINK), 'Cart Link');
  }
}
