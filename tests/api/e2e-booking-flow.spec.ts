import { test, expect } from '@fixtures/api.fixtures';
import { BookingBuilder } from '@api/request-builders/BookingBuilder';
import { CreateBookingResponseSchema, BookingSchema } from '@schemas/booking.schemas';

test.describe('API E2E Flow: Complete Booking Lifecycle @e2e', () => {
  test('Create → Update → Verify → Delete booking', async ({ bookingClient }) => {
    // Step 1: CREATE a new booking
    const createPayload = new BookingBuilder()
      .withFirstName('E2E_Test')
      .withLastName('User')
      .build();

    const createResponse = await bookingClient.createBooking(createPayload);
    expect(createResponse.status()).toBe(200);

    const createBody = await createResponse.json();
    const createValidation = CreateBookingResponseSchema.safeParse(createBody);
    expect(createValidation.success).toBe(true);

    const bookingId: number = createBody.bookingid;
    expect(bookingId).toBeDefined();
    expect(createBody.booking.firstname).toBe('E2E_Test');
    expect(createBody.booking.lastname).toBe('User');

    // Step 2: UPDATE the booking
    const updatePayload = new BookingBuilder()
      .withFirstName('Updated_E2E')
      .withLastName('Updated_User')
      .withTotalPrice(999)
      .withAdditionalNeeds('Lunch')
      .build();

    const updateResponse = await bookingClient.updateBooking(bookingId, updatePayload);
    expect(updateResponse.status()).toBe(200);

    const updateBody = await updateResponse.json();
    expect(updateBody.firstname).toBe('Updated_E2E');
    expect(updateBody.lastname).toBe('Updated_User');
    expect(updateBody.totalprice).toBe(999);
    expect(updateBody.additionalneeds).toBe('Lunch');

    // Step 3: VERIFY the update by fetching the booking
    const getResponse = await bookingClient.getBooking(bookingId);
    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();
    const getValidation = BookingSchema.safeParse(getBody);
    expect(getValidation.success).toBe(true);
    expect(getBody.firstname).toBe('Updated_E2E');
    expect(getBody.lastname).toBe('Updated_User');
    expect(getBody.totalprice).toBe(999);

    // Step 4: DELETE the booking
    const deleteResponse = await bookingClient.deleteBooking(bookingId);
    expect(deleteResponse.status()).toBe(201); // Restful-booker returns 201 for delete

    // Step 5: VERIFY deletion — booking should no longer exist
    const verifyDeleteResponse = await bookingClient.getBooking(bookingId);
    expect(verifyDeleteResponse.status()).toBe(404);
  });
});
