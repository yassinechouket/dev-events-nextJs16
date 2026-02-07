
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres'
import { neon } from '@neondatabase/serverless'

import * as schema from './schema'

export const db = process.env.VERCEL
  ? drizzleNeon({
      client: neon(process.env.DATABASE_URL!),
      schema,
      casing: 'snake_case',
    })
  : drizzlePostgres(process.env.DATABASE_URL!, { schema, casing: 'snake_case' })




export { default as Event } from './event.model';
export { default as Booking } from './booking.model';

// TypeScript interfaces exports
export type { IEvent } from './event.model';
export type { IBooking } from './booking.model';
