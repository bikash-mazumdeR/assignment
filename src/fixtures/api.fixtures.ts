import { test as base } from '@playwright/test';
import { RequestWrapper } from '@core/RequestWrapper';
import { BookingClient } from '@api/BookingClient';

type APIWorkspaces = {
  apiClient: RequestWrapper;
  bookingClient: BookingClient;
};

export const test = base.extend<APIWorkspaces>({
  apiClient: async ({ request }, use) => {
    await use(new RequestWrapper(request));
  },
  bookingClient: async ({ apiClient }, use) => {
    await use(new BookingClient(apiClient));
  },
});

export { expect } from '@playwright/test';
