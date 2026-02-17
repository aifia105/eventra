import { Event } from "@/lib/types";

export const fetchEvent = async (eventId: string): Promise<Event> => {
  const res = await fetch(`/api/event/${eventId}`);
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
};
