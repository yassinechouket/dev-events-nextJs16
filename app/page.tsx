import ExploreBtn from "./components/ExploreBtn";
import EventCard from "./components/EventCard";
import {IEvent} from "../database/event.model";
import {cacheLife} from "next/cache";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;



const Home = async() => {
  'use cache'
  cacheLife('hours')
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
  

  
  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center relative z-10">
        <div className="text-center mb-8 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-400 bg-clip-text text-transparent">
            The Hub for Every Dev <br /> Event You Can't Miss
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light mb-12">
            Hackathons, Meetups, and Conferences, All in One Place
          </p>
        </div>

        <ExploreBtn />
      </section>

      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
            Featured Events
          </h2>

          <ul className="events">
            {events.map((event:IEvent) => (
              <EventCard key={event.title} title={event.title} image={event.image} slug={event.slug} location={event.location} date={event.date} time={event.time} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

export default Home