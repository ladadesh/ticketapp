import { api } from "@/convex/_generated/api"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useStorageUrl(storageId: Id<"_storage"> | undefined){
  return useQuery(api.storage.getUrl, storageId ? (storageId) : "skip");
}