"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Calendar, MapPin, Users, Loader2, Search } from "lucide-react";

interface PublicEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  availableSeats: number;
  type: string;
  organizer: string;
}

async function fetchPublicEvents(): Promise<PublicEvent[]> {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export default function ClientEventsPage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: fetchPublicEvents,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
        <p className="text-gray-500 mt-1">
          Find and book seats for upcoming events
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !events || events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-gray-100 p-6 mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No events available
          </h3>
          <p className="text-gray-500 max-w-sm">
            Check back later for upcoming events
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            const isUpcoming = eventDate > new Date();
            return (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-2xl bg-accent/10 shadow-lg transition-all duration-300"
              >
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      isUpcoming
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {isUpcoming ? "Upcoming" : "Past"}
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-xs font-medium text-primary mb-1">
                    By {event.organizer}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pr-20 line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <span>
                        {eventDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="truncate">{event.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span>{event.availableSeats} seats</span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/client/events/${event.id}/seats`}
                    className="block w-full text-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    View Seats & Book
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
