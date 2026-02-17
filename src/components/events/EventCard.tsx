import { Calendar, Edit, MapPin, Trash2, Users, Settings } from "lucide-react";
import React from "react";
import Link from "next/link";

interface EventCardProps {
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    availableSeats: number;
    type: string;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg bg-accent/10">
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
        <h3 className="text-lg font-bold text-gray-900 mb-3 pr-20 line-clamp-2 group-hover:text-primary transition-colors">
          {event.name}
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium truncate">
              {eventDate.toLocaleDateString("en-US", {
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

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                event.type === "public"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)} Event
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Link
            href={`/dashboard/org/events/${event.id}/stage`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary "
          >
            <Settings className="h-4 w-4" />
            Set Up Stage
          </Link>
          <Link
            href={`/dashboard/org/events/${event.id}/edit`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 "
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <button
            className="inline-flex items-center cursor-pointer justify-center rounded-xl bg-red-50 p-2.5 text-red-600 "
            title="Delete event"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
