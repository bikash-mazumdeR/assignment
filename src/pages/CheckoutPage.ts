import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { SELECTORS } from '../constants/selectors';

export class CheckoutPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly completeHeader: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator(SELECTORS.CHECKOUT.FIRST_NAME);
    this.lastNameInput = page.locator(SELECTORS.CHECKOUT.LAST_NAME);
    this.postalCodeInput = page.locator(SELECTORS.CHECKOUT.POSTAL_CODE);
    this.continueButton = page.locator(SELECTORS.CHECKOUT.CONTINUE_BUTTON);
    this.finishButton = page.locator(SELECTORS.CHECKOUT.FINISH_BUTTON);
    this.completeHeader = page.locator(SELECTORS.CHECKOUT.COMPLETE_HEADER);
    this.errorMessage = page.locator(SELECTORS.CHECKOUT.ERROR_MESSAGE);
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.fill(this.firstNameInput, firstName, 'First Name');
    await this.fill(this.lastNameInput, lastName, 'Last Name');
    await this.fill(this.postalCodeInput, postalCode, 'Postal Code');
    await this.click(this.continueButton, 'Continue Button');
  }

  async finishCheckout() {
    await this.click(this.finishButton, 'Finish Button');
  }

  async getCompletionMessage(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }
}
