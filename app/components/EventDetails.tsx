import {cacheLife} from "next/cache";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 
  (process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000');

const EventDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
    'use cache'
    cacheLife('hours');
    const { slug } = await params;
    
    let event;
    try {
        const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
            next: { revalidate: 60 }
        });

        if (!request.ok) {
            if (request.status === 404) {
                return notFound();
            }
            throw new Error(`Failed to fetch event: ${request.statusText}`);
        }

        const response = await request.json();
        event = response.event;

        if (!event) {
            return notFound();
        }
    } catch (error) {
        console.error('Error fetching event:', error);
        return notFound();
    }

  
  return (
    <>
        <h1>Event Details :{slug}</h1>
        <p>{event.description}</p>
        <img src={event.image} alt={event.title} />
    </>
    

  )
}

export default EventDetails