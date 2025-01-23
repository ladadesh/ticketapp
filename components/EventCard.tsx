"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useStorageUrl } from "@/lib/utils";

const EventCard = ({ eventId }: { eventId: Id<"events"> }) => {
  const { user } = useUser();
  const router = useRouter();
  const event = useQuery(api.events.getEventById, { eventId });
  const eventAvailablity = useQuery(api.events.getEventAvailablity, {
    eventId,
  });
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });
  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !eventAvailablity) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();
  const isEventOwner = user?.id === event?.userId;

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden relative ${isPastEvent ? "opacity-75 hover:opacity-100" : ""}`}
    ></div>
  );
};
export default EventCard;
