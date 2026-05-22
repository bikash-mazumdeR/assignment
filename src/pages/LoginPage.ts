import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { env } from '@config/env.config';
import { SELECTORS } from '../constants/selectors';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator(SELECTORS.LOGIN.USERNAME);
    this.passwordInput = page.locator(SELECTORS.LOGIN.PASSWORD);
    this.loginButton = page.locator(SELECTORS.LOGIN.LOGIN_BUTTON);
    this.errorMessage = page.locator(SELECTORS.LOGIN.ERROR_MESSAGE);
  }

  async open() {
    await this.navigate(env.BASE_URL);
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username, 'Username');
    await this.fill(this.passwordInput, password, 'Password');
    await this.click(this.loginButton, 'Login Button');
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }
}
