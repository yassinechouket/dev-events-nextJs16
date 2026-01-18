import {cacheLife} from "next/cache";
import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "./BookEvent";
import { getSimilarEventsBySlug } from "@/lib/action/event.actions";
import {IEvent} from "@/database";
import EventCard from "./EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not set');
}

const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string; }) => (
    <div className="flex-row-gap-2 items-center p-3 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-colors">
        <div className="p-2 rounded-md bg-cyan-500/10">
            <Image src={icon} alt={alt} width={20} height={20} className="text-cyan-400" />
        </div>
        <p className="font-medium text-cyan-100">{label}</p>
    </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className="agenda bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">Agenda</h2>
        <ul className="space-y-3">
            {agendaItems.map((item, idx) => (
                <li key={item} className="flex items-start gap-3 text-slate-200 text-base">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">{idx + 1}</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-2 flex-wrap pt-4">
        {tags.map((tag) => (
            <div key={tag} className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 text-sm font-medium hover:from-cyan-500/30 hover:to-blue-500/30 transition-colors">
                #{tag}
            </div>
        ))}
    </div>
)
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
    const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;
    const bookings = 10;
    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  
  return (
        <section id="event">
            <div className="header bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700/50 backdrop-blur-sm">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">{description}</h1>
            </div>

            <div className="details">
                {/*    Left Side - Event Content */}
                <div className="content">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/20">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <Image src={image} alt="Event Banner" width={800} height={400} className="banner w-full h-auto object-cover" />
                    </div>

                    <section className="flex-col-gap-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Overview</h2>
                        <p className="text-slate-200 leading-relaxed">{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">Event Details</h2>
                        <div className="grid gap-3">
                            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
                            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
                            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
                        </div>
                    </section>
                    <EventAgenda agendaItems={agenda} />

                    <section className="flex-col-gap-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">About the Organizer</h2>
                        <p className="text-slate-200 leading-relaxed">{organizer}</p>
                    </section>

                    <EventTags tags={tags} />
                </div>
                <aside className="booking">
                    <div className="signup-card bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 shadow-2xl">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">Book Your Spot</h2>
                        {bookings > 0 ? (
                            <p className="text-sm text-slate-200 mb-4">
                                🎉 Join {bookings} people who have already booked their spot!
                            </p>
                        ): (
                            <p className="text-sm text-slate-200 mb-4">🚀 Be the first to book your spot!</p>
                        )}

                        <BookEvent eventId={event._id} slug={event.slug} />
                    </div>
                </aside>
            </div>
            <div className="flex w-full flex-col gap-6 pt-20">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 ? (
                        similarEvents.map((similarEvent: IEvent) => (
                            <EventCard key={similarEvent.title} {...similarEvent} />
                        ))
                    ) : (
                        <p className="text-slate-300 text-center py-8">No similar events found.</p>
                    )}
                </div>
            </div>
        </section>
        
    

  )
}

export default EventDetails