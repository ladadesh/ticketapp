"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "@/node_modules/next/router";
import { useQuery } from "convex/react";

const EventCard = ({ eventId }: { eventId: Id<"events"> }) => {
  const { user } = useUser();
  //   const router = useRouter();
  const event = useQuery(api.events.getEventById, { eventId });

  console.log("event", event);

  return <div>EventCard</div>;
};
export default EventCard;
