"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useParams } from "@/node_modules/next/navigation";
import { useQuery } from "convex/react";
import Spinner from "@/components/Spinner";
import Image from "@/node_modules/next/image";
import { CalendarDays } from "@/node_modules/lucide-react";
import { MapPin } from "@/node_modules/lucide-react";
import { Ticket, Users } from "@/node_modules/lucide-react";
import EventCard from "@/components/EventCard";
import { SignedOut, SignInButton, UserButton, SignedIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import JoinQueue from "@/components/JoinQueue";

const EventPage = () => {
  const { user } = useUser();
  const params = useParams();

  const event = useQuery(api.events.getEventById, {
    eventId: params?.id as Id<"events">,
  });

  const eventAvailabilty = useQuery(api.events.getEventAvailability, {
    eventId: params?.id as Id<"events">,
  });

  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !eventAvailabilty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* event details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* event image */}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={event?.name}
              fill
              className="object-cover"
              priority
            />
          )}

          {/* event details info */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* left column - event Details */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {event?.name}
                  </h1>
                  <p className="text-lg text-gray-600">{event?.description}</p>
                </div>

                {/* event info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Date</span>
                    </div>
                    <p className="text-gray-900">
                      {new Date(event?.eventDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-gray-900">{event?.location}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Ticket className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Price</span>
                    </div>
                    <p className="text-gray-900">₹{event?.price?.toFixed()}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">
                        Event Availability
                      </span>
                    </div>
                    <p className="text-gray-900">
                      {eventAvailabilty?.totalTickets -
                        eventAvailabilty?.purchaseCount}{" "}
                      / {eventAvailabilty?.totalTickets} left
                    </p>
                  </div>
                </div>

                {/* additional event information */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Event Information
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>* Please arrive 30 minutes before the event starts</li>
                    <li>* Tickets are non-refundable</li>
                    <li>* Age rescrictions: 18+</li>
                  </ul>
                </div>
              </div>

              {/* right column - book event */}
              <div>
                <div className="sticky top-8 space-y-4">
                  <EventCard eventId={params?.id as Id<"events">} />

                  {user ? (
                    <JoinQueue
                      eventId={params?.id as Id<"events">}
                      userId={user.id}
                    />
                  ) : (
                    <SignInButton>
                      <Button className="w-full bg-gradient-to-r from-blue-600 t0-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                        Sign in to buy tickets
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventPage;
