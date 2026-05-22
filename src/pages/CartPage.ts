import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { SELECTORS } from '../constants/selectors';

export class CartPage extends BasePage {
  private readonly checkoutButton: Locator;
  private readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.locator(SELECTORS.CART.CHECKOUT_BUTTON);
    this.cartItems = page.locator(SELECTORS.CART.ITEM);
  }

  async proceedToCheckout() {
    await this.click(this.checkoutButton, 'Checkout Button');
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async removeItem(productName: string) {
    const itemLocator = this.page.locator(SELECTORS.CART.ITEM, { hasText: productName });
    await this.click(itemLocator.locator(SELECTORS.CART.REMOVE_BUTTON), `Remove ${productName} from cart`);
  }
}
