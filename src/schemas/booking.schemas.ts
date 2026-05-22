import { z } from 'zod';

export const AuthResponseSchema = z.object({
  token: z.string(),
});

export const BookingDatesSchema = z.object({
  checkin: z.string(),
  checkout: z.string(),
});

export const BookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: BookingDatesSchema,
  additionalneeds: z.string().optional(),
});

export const CreateBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: BookingSchema,
});

export const BookingIdSchema = z.object({
  bookingid: z.number(),
});

// Type exports derived from Zod schemas
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type BookingDates = z.infer<typeof BookingDatesSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type CreateBookingResponse = z.infer<typeof CreateBookingResponseSchema>;
export type BookingId = z.infer<typeof BookingIdSchema>;
