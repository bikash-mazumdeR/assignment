import { test, expect } from '@fixtures/api.fixtures';
import { BookingBuilder } from '@api/request-builders/BookingBuilder';
import { CreateBookingResponseSchema } from '@schemas/booking.schemas';

test.describe('Booking Parameterized / Data-Driven Tests @regression @api', () => {
  const testCases = [
    {
      description: 'Standard booking with breakfast',
      firstname: 'Alice',
      lastname: 'Smith',
      totalprice: 150,
      depositpaid: true,
      additionalneeds: 'Breakfast',
    },
    {
      description: 'Booking with special character names',
      firstname: "O'Connor",
      lastname: 'Müller-Schulz',
      totalprice: 299,
      depositpaid: false,
      additionalneeds: 'Late Checkout',
    },
    {
      description: 'Booking with zero price and empty additional needs',
      firstname: 'Bob',
      lastname: 'Free',
      totalprice: 0,
      depositpaid: true,
      additionalneeds: '',
    },
  ];

  for (const tc of testCases) {
    test(`Data-Driven Create: ${tc.description}`, async ({ bookingClient }) => {
      const payload = new BookingBuilder()
        .withFirstName(tc.firstname)
        .withLastName(tc.lastname)
        .withTotalPrice(tc.totalprice)
        .withDepositPaid(tc.depositpaid)
        .withAdditionalNeeds(tc.additionalneeds)
        .build();

      const response = await bookingClient.createBooking(payload);
      expect(response.status()).toBe(200);

      const body = await response.json();
      const result = CreateBookingResponseSchema.safeParse(body);
      expect(result.success).toBe(true);

      expect(body.booking.firstname).toBe(tc.firstname);
      expect(body.booking.lastname).toBe(tc.lastname);
      expect(body.booking.totalprice).toBe(tc.totalprice);
      expect(body.booking.depositpaid).toBe(tc.depositpaid);
      expect(body.booking.additionalneeds).toBe(tc.additionalneeds);

      // Best-effort cleanup
      const bookingId = body.bookingid;
      expect(bookingId).toBeDefined();
      await bookingClient.deleteBooking(bookingId).catch(() => {});
    });
  }
});
