import { CalendarDays, ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { Event } from "@/lib/types";

const EventDropdown = ({
  events,
  selected,
  onSelect,
}: {
  events: Event[];
  selected: Event | null;
  onSelect: (e: Event) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-3 h-12 pl-4 pr-3 rounded-xl border border-gray-200 bg-white hover:border-primary/40 transition-colors shadow-sm text-sm font-medium text-gray-700 min-w-64"
      >
        <CalendarDays className="h-4 w-4 text-primary shrink-0" />
        <span className="flex-1 text-left truncate">
          {selected ? selected.name : "Select an event…"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-full z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {events.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4 px-4">
              No events found
            </p>
          ) : (
            events.map((event) => (
              <button
                key={event._id}
                onClick={() => {
                  onSelect(event);
                  setOpen(false);
                }}
                className={`
                                    w-full text-left px-4 py-3 flex flex-col gap-0.5 hover:bg-gray-50 transition-colors
                                    ${selected?._id === event._id ? "bg-primary/5 border-l-2 border-primary" : ""}
                                `}
              >
                <span className="text-sm font-medium text-gray-900 truncate">
                  {event.name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {event.venue ? ` · ${event.venue}` : ""}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EventDropdown;
