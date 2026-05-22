import { Page, Locator } from '@playwright/test';
import { logger } from './Logger';
import { redactValue, redactUrl } from './RedactionHelper';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected async navigate(path: string) {
    logger.info(`Navigating to: ${redactUrl(path)}`);
    await this.page.goto(path, { waitUntil: 'networkidle' });
  }

  protected async click(locator: Locator, name: string) {
    logger.info(`Clicking on: ${name}`);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  protected async fill(locator: Locator, value: string, name: string) {
    const displayValue = redactValue(name, value);
    logger.info(`Filling ${name} with value: ${displayValue}`);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  protected async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()) || '';
  }

  protected async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async waitForElement(locator: Locator) {
    await locator.waitFor({ state: 'attached' });
  }
}
