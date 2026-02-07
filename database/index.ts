import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

import * as schema from './schema'

export const db = drizzle({
  client: neon(process.env.DATABASE_URL!),
  schema,
  casing: 'snake_case',
})

export { default as Event } from './event.model';
export { default as Booking } from './booking.model';

export type { IEvent } from './event.model';
export type { IBooking } from './booking.model';