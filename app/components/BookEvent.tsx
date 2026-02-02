// components/BookEvent.tsx
"use client";

import { useState } from "react";
import { Input, Button } from "./ui";
import { createBookingSafe } from "@/lib/action/booking.safe";
import type { BookingResult } from "@/lib/schemas/booking.schema";

type BookEventProps = {
  eventId: string;
  slug: string;
};

export default function BookEvent({ eventId, slug }: BookEventProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    const bookingResult = await createBookingSafe({
      eventId,
      slug,
      email,
    });

    setResult(bookingResult);
  }

  if (result?.success) {
    return <p className="text-sm">Thank you for signing up!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email Address</label>
        <Input
          id="email"
          type="email"
          value={email ?? ""}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
        />
      </div>

      {result?.error && (
        <p className="text-red-500 text-sm">{result.error}</p>
      )}

      <Button type="submit" className="button-submit">
        Submit
      </Button>
    </form>
  );
}
