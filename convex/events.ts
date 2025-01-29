import {v} from "convex/values";
import { TICKET_STATUS, WAITING_LIST_STATUS } from "./constants";
import {mutation, query } from "./_generated/server";

export const getAllEvents =  query({//for getting all events
    args : {},
    handler: async (ctx) => {  
        return await ctx.db
            .query("events")
            .filter((q)=>q.eq(q.field("is_cancelled"),undefined))
            .collect()
    }
});

export const getEventById = query({
    args : {eventId : v.id("events")},
    handler : async (ctx,{eventId}) => {
        return await ctx.db.get(eventId);
    }
})

export const getEventAvailability = query({
    args: {eventId :  v.id("events")},
    handler : async (ctx,{eventId}) => {
        const event = await ctx.db.get(eventId);
        if(!event) throw new Error("Event not Found");

        //count total purchased tickets
        const purchaseCount = await ctx.db
            .query("tickets")
            .withIndex("by_event",(q)=>q.eq("eventId",eventId))
            .collect()
            .then(
                (tickets) =>
                    tickets.filter(
                        t =>
                            t.status === TICKET_STATUS.VALID ||
                            t.status === TICKET_STATUS.USED
                    ).length
            );

        //count current valid offers
        //ongoing offered tickets, which are in payment queue
        const now = new Date();
        const activeOffers = await ctx.db
            .query("waitingList")
            .withIndex("by_event_status",(q) =>
                q.eq("eventId",eventId).eq("status",WAITING_LIST_STATUS.OFFERED)
            )
            .collect()
            .then(
                entries => entries.filter((e)=> (e.offerExpiresAt ?? 0) > now).length 
            )

        const totalReserved = purchaseCount + activeOffers;//here purchaseCount is tickets which are already purchased and activeOffers are ongoing tickets

        return {
            isSoldOut : totalReserved >= event.totalTickets,
            totalTickets : event.totalTickets,
            purchaseCount,
            activeOffers,
            remainingTickets : Math.max(0, event.totalTickets - totalReserved)
        };
    }
})
