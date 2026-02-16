"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventData {
  id: string;
  name: string;
  date: string;
  location: string;
  availableSeats: number;
  type: string;
}

interface EventSelectorProps {
  events: EventData[];
  onSelect?: (event: EventData) => void;
}

export function EventSelector({ events, onSelect }: EventSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData>(events[0]);

  const handleSelect = (event: EventData) => {
    setSelectedEvent(event);
    setIsOpen(false);
    onSelect?.(event);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-xl border bg-accent/10 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-200 min-w-[280px]"
      >
        <span className="flex-1 text-left truncate">{selectedEvent.name}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-20 mt-2 w-full min-w-[280px] rounded-xl  bg-white shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-[300px] overflow-y-auto p-2">
              {events
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleSelect(event)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors duration-150",
                      selectedEvent.id === event.id
                        ? "text-primary font-medium"
                        : "text-gray-700 hover:bg-gray-50 rounded-lg",
                    )}
                  >
                    <span className="truncate">{event.name}</span>
                    {selectedEvent.id === event.id && (
                      <Check className="h-4 w-4 flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
