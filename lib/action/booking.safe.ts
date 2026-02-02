import { BookingResultSchema, BookingResult } from "@/lib/schemas/booking.schema";
import { createBooking } from "@/lib/action/booking.actions";

type CreateBookingInput ={
    eventId: string;
    slug: string;
    email: string;
}

export async function createBookingSafe(input: CreateBookingInput): Promise<BookingResult> {
    const raw = await createBooking(input);
    return BookingResultSchema.parse(raw);
}