import {Suspense} from "react";
import EventDetails from "../../components/EventDetails";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>}) => {
    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-1 bg-slate-950 rounded-full"></div>
                    </div>
                </div>
            }>
                <EventDetails params={params} />
            </Suspense>
        </main>
    )
}
export default EventDetailsPage