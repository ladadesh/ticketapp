import { defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    events : defineTable({// events schema
        name : v.string(),
        description : v.string(),
        location : v.string(),
        eventDate : v.number(),
        price : v.number(),
        totalTickets : v.number(),
        userId : v.string(),
        imageStorageId : v.optional(v.id("_storage")),
        is_cancelled : v.optional(v.boolean()),
    }),

    tickets : defineTable({//tickets schema
        eventId : v.id("events"),
        userId : v.string(),
        purchaseAt : v.number(),
        status : v.union(
            v.literal("valid"),
            v.literal("used"),
            v.literal("refunded"),
            v.literal("cancelled")
        ),
        paymentIntentId : v.optional(v.string()), //for payment info or can be used for refund purpose
        amount : v.optional(v.number()),
    })
        .index("by_event",["eventId"])//this index are used when we need to find some specific data real quick
        .index("by_user",["userId"])
        .index("by_user_event",["userId","eventId"])
        .index("by_payment_intent",["paymentIntentId"]),

    waitingList : defineTable({// waiting List schema
        eventId : v.id("events"),
        userId : v.string(),
        status : v.union(
            v.literal("waiting"),
            v.literal("offered"),
            v.literal("purchased"),
            v.literal("expired")
        ),
        offerExpiresAt : v.optional(v.number()),
    })
        .index("by_event_status",["eventId","status"])
        .index("by_user_event",["userId","eventId"])
        .index("by_user",["userId"]),

    users : defineTable({// user Schema
        name : v.string(),
        email : v.string(),
        userId : v.string(),
        stripeConnectId : v.optional(v.string()),
    })    
        .index("by_user_id",["userId"])
        .index("by_email",["email"])
})