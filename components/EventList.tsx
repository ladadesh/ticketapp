"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Spinner from "./Spinner";
import { useMemo } from "react";
import { CalendarDays, Ticket } from "@/node_modules/lucide-react";
import EventCard from "./EventCard";

const EventList = () => {
  const events = useQuery(api.events.getAllEvents) || [];

  if (!events) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const upComingEvents = useMemo(() => {
    return events
      .filter((event) => event.eventDate > new Date())
      .sort((a, b) => b.eventDate - a.eventDate);
  }, [events]);

  const pastEvents = useMemo(() => {
    return events
      .filter((event) => event.eventDate <= new Date())
      .sort((a, b) => b.eventDate - a.eventDate);
  }, [events]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="mt-2 text-gray-600">
            Discover & book tickets for amazing events on Ticketiè.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays className="w-5 h-5" />
            <span className="font-medium">
              {upComingEvents.length} Upcoming Events
            </span>
          </div>
        </div>
      </div>

      {/* upcoming events grid*/}
      {upComingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {upComingEvents?.map((event) => (
            <EventCard key={event?._id} eventId={event?._id} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center mb-12">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No upcoming events on Ticketiè. Either the world’s gone boring, or
            we’re just too exclusive. Stay tuned!👽
          </h3>
          <p className="text-gray-600 mt-1">
            Hold your beer till then—don’t worry, it’s a marathon, not a sprint.
            Cheers! 🍻
          </p>
        </div>
      )}

      {/* past events grid */}
      {pastEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-500 mb-6">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {pastEvents?.map((event) => (
              <EventCard key={event?._id} eventId={event?._id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default EventList;
