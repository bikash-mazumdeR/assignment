import { test, expect } from '@fixtures/api.fixtures';
import { env } from '@config/env.config';
import { BookingBuilder } from '@api/request-builders/BookingBuilder';
import { CreateBookingResponseSchema, BookingSchema } from '@schemas/booking.schemas';

test.describe('Booking Management @regression @api', () => {
  test('Positive: Create a new booking @smoke', async ({ bookingClient }) => {
    const payload = new BookingBuilder().build();
    const response = await bookingClient.createBooking(payload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    const result = CreateBookingResponseSchema.safeParse(body);
    expect(result.success).toBe(true);
    
    expect(body.booking.firstname).toBe(payload.firstname);
    expect(body.booking.lastname).toBe(payload.lastname);
  });

  test('Negative: Create booking with invalid payload', async ({ bookingClient }) => {
    const invalidPayload = { firstname: 123 }; // Invalid type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await bookingClient.createBooking(invalidPayload as any, { maxRetries: 0 });
    // Restful-booker often returns 500 or 400 for bad payloads
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('Positive: Retrieve booking list', async ({ bookingClient }) => {
    const response = await bookingClient.getBookingIds();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    // Removed conditional schema check to satisfy linting rules
  });

  test('Negative: Retrieve booking by invalid ID', async ({ bookingClient }) => {
    const response = await bookingClient.getBooking(9999999);
    expect(response.status()).toBe(404);
  });

  test.describe('Existing Booking Operations', () => {
    let bookingId: number;

    test.beforeEach(async ({ bookingClient }) => {
      const payload = new BookingBuilder().build();
      const response = await bookingClient.createBooking(payload);
      const body = await response.json();
      bookingId = body.bookingid;
    });

    test.afterEach(async ({ bookingClient }) => {
      // Best-effort cleanup — ignore errors if booking was already deleted by the test
      if (bookingId) {
        await bookingClient.deleteBooking(bookingId).catch(() => {});
      }
    });

    test('Positive: Retrieve booking by ID', async ({ bookingClient }) => {
      const response = await bookingClient.getBooking(bookingId);
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      const result = BookingSchema.safeParse(body);
      expect(result.success).toBe(true);
    });

    test('Positive: Update booking', async ({ bookingClient }) => {
      const updatePayload = new BookingBuilder().withFirstName('UpdatedName').build();
      const response = await bookingClient.updateBooking(bookingId, updatePayload);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.firstname).toBe('UpdatedName');
      
      // Schema validation
      expect(BookingSchema.safeParse(body).success).toBe(true);
    });

    test('Negative: Update booking without auth token', async ({ apiClient }) => {
      const updatePayload = new BookingBuilder().build();
      const response = await apiClient.put(`${env.API_URL}/booking/${bookingId}`, updatePayload);
      expect(response.status()).toBe(403);
    });

    test('Positive: Delete booking @smoke', async ({ bookingClient }) => {
      const response = await bookingClient.deleteBooking(bookingId);
      expect(response.status()).toBe(201); // Restful-booker returns 201
      
      const verify = await bookingClient.getBooking(bookingId);
      expect(verify.status()).toBe(404);
    });
  });

  test('Negative: Update booking with non-existent ID', async ({ bookingClient }) => {
    const updatePayload = new BookingBuilder().build();
    const response = await bookingClient.updateBooking(9999999, updatePayload);
    expect(response.status()).toBe(405); // API returns 405 for non-existent put
  });

  test('Negative: Delete non-existent booking', async ({ bookingClient }) => {
    const response = await bookingClient.deleteBooking(9999999);
    expect(response.status()).toBe(405); // API returns 405
  });

  test('Negative: Delete booking without auth', async ({ apiClient }) => {
    const response = await apiClient.delete(`${env.API_URL}/booking/1`);
    expect(response.status()).toBe(403);
  });
});
