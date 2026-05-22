import { faker } from '@faker-js/faker';
import { Booking } from '@schemas/booking.schemas';

export class BookingBuilder {
  private booking: Booking;

  constructor() {
    this.booking = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 100, max: 1000 }),
      depositpaid: true,
      bookingdates: {
        checkin: '2025-01-01',
        checkout: '2025-01-10',
      },
      additionalneeds: 'Breakfast',
    };
  }

  withFirstName(firstName: string): this {
    this.booking.firstname = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.booking.lastname = lastName;
    return this;
  }

  withTotalPrice(price: number): this {
    this.booking.totalprice = price;
    return this;
  }

  withDates(checkin: string, checkout: string): this {
    this.booking.bookingdates = { checkin, checkout };
    return this;
  }

  withAdditionalNeeds(needs: string): this {
    this.booking.additionalneeds = needs;
    return this;
  }

  withDepositPaid(paid: boolean): this {
    this.booking.depositpaid = paid;
    return this;
  }

  build(): Booking {
    return { ...this.booking };
  }
}
