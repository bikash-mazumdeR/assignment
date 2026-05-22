import { RequestWrapper } from '@core/RequestWrapper';
import { env } from '@config/env.config';
import { TokenManager } from './TokenManager';
import { Booking } from '@schemas/booking.schemas';

export class BookingClient {
  constructor(private readonly request: RequestWrapper) {}

  async createBooking(data: Booking, options?: { maxRetries?: number }) {
    return await this.request.post(`${env.API_URL}/booking`, data, undefined, options);
  }

  async getBooking(id: number, options?: { maxRetries?: number }) {
    return await this.request.get(`${env.API_URL}/booking/${id}`, undefined, undefined, options);
  }

  async getBookingIds(params?: Record<string, string>, options?: { maxRetries?: number }) {
    return await this.request.get(`${env.API_URL}/booking`, params, undefined, options);
  }

  async updateBooking(id: number, data: Booking, options?: { maxRetries?: number }) {
    const token = await TokenManager.getToken(this.request);
    return await this.request.put(`${env.API_URL}/booking/${id}`, data, {
      Cookie: `token=${token}`,
    }, options);
  }

  async deleteBooking(id: number, options?: { maxRetries?: number }) {
    const token = await TokenManager.getToken(this.request);
    return await this.request.delete(`${env.API_URL}/booking/${id}`, {
      Cookie: `token=${token}`,
    }, options);
  }
}
