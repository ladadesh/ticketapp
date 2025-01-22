import {v} from "convex/values";
import {mutation, query } from "./_generated/server";

export const getAllEvents =  query({//for getting all events
    args : {},
    handler: async (ctx) => {  
        return await ctx.db
            .query("events")
            .filter((q)=>q.eq(q.field("is_cancelled"),undefined))
            .collect()
    }
}) 
