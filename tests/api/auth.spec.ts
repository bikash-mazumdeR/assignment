import { test, expect } from '@fixtures/api.fixtures';
import { env } from '@config/env.config';
import { AuthResponseSchema } from '@schemas/booking.schemas';

test.describe('API Authentication @regression @api', () => {
  test('Positive: Generate token with valid credentials @smoke', async ({ apiClient }) => {
    const response = await apiClient.post(`${env.API_URL}/auth`, {
      username: env.API_USER,
      password: env.API_PASS,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    const result = AuthResponseSchema.safeParse(body);
    expect(result.success).toBe(true);
    expect(body.token).toBeDefined();
  });

  test('Negative: Invalid credentials', async ({ apiClient }) => {
    const response = await apiClient.post(`${env.API_URL}/auth`, {
      username: 'invalid_user',
      password: 'wrong_password',
    });
    
    expect(response.status()).toBe(200); // API quirk: returns 200
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });

  test('Negative: Missing fields in payload', async ({ apiClient }) => {
    const response = await apiClient.post(`${env.API_URL}/auth`, {
      username: env.API_USER
      // password missing
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });

  test('Negative: Empty payload', async ({ apiClient }) => {
    const response = await apiClient.post(`${env.API_URL}/auth`, {});
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });
});
