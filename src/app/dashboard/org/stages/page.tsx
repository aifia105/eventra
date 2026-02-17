"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  Wifi,
  WifiOff,
  Users,
  Ticket,
  Clock,
  RefreshCw,
  CalendarDays,
  Radio,
} from "lucide-react";
import { ActivityItem, Seat, Event, StageShape } from "@/lib/types";
import { fetchEvents, fetchSeats } from "@/lib/actions/stage";
import EventDropdown from "@/components/seat-management/EventDropdown";
import StatsBar from "@/components/seat-management/StatsBar";
import OccupancyBar from "@/components/seat-management/OccupancyBar";
import Legend from "@/components/seat-management/Legend";
import SeatGrid from "@/components/seat-management/SeatGrid";
import ActivityFeed from "@/components/seat-management/ActivityFeed";

const Seats = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLive, setIsLive] = useState(true);
  const prevSeatsRef = useRef<Seat[]>([]);
  const activityIdRef = useRef(0);

  const eventsQuery = useQuery({
    queryKey: ["org-events"],
    queryFn: fetchEvents,
  });

  const seatsQuery = useQuery({
    queryKey: ["seats", selectedEvent?._id],
    queryFn: () => fetchSeats(selectedEvent!._id),
    enabled: !!selectedEvent,
    refetchInterval: isLive ? 5000 : false,
    refetchIntervalInBackground: true,
  });

  const seats: Seat[] = seatsQuery.data ?? [];
  const stageShape: StageShape =
    (seats[0]?.stageShape as StageShape) ?? "rectangle";

  useEffect(() => {
    const prev = prevSeatsRef.current;
    if (prev.length === 0 || seats.length === 0) {
      prevSeatsRef.current = seats;
      return;
    }

    const prevMap = new Map(prev.map((s) => [s._id, s]));

    seats.forEach((seat) => {
      const old = prevMap.get(seat._id);
      if (!old) return;
      if (old.status === seat.status) return;

      const label = `${seat.row}${seat.number}`;
      let message = "";
      let type: ActivityItem["type"] = "reserved";

      if (seat.status === "reserved") {
        message = `Seat ${label} was reserved${seat.reservedBy ? ` by ${seat.reservedBy}` : ""}`;
        type = "reserved";
      } else if (seat.status === "locked") {
        message = `Seat ${label} is being locked / held`;
        type = "locked";
      } else {
        message = `Seat ${label} became available`;
        type = "released";
      }

      const newActivity: ActivityItem = {
        id: String(activityIdRef.current++),
        message,
        time: new Date(),
        type,
      };

      setActivities((prev) => [newActivity, ...prev].slice(0, 50));
    });

    prevSeatsRef.current = seats;
  }, [seats]);

  const lastUpdated = seatsQuery.dataUpdatedAt
    ? new Date(seatsQuery.dataUpdatedAt).toLocaleTimeString()
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seat Monitor</h1>
          <p className="text-gray-500 mt-0.5">
            Real-time seat availability for your events
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive((l) => !l)}
            className={`
                            inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all
                            ${
                              isLive
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-gray-50 border-gray-200 text-gray-500"
                            }
                        `}
          >
            {isLive ? (
              <>
                <Wifi className="h-4 w-4" />
                Live
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                Paused
              </>
            )}
          </button>

          <button
            onClick={() => seatsQuery.refetch()}
            disabled={seatsQuery.isFetching}
            className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw
              className={`h-4 w-4 text-gray-500 ${seatsQuery.isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <EventDropdown
          events={eventsQuery.data ?? []}
          selected={selectedEvent}
          onSelect={(e) => {
            setSelectedEvent(e);
            setActivities([]);
            prevSeatsRef.current = [];
          }}
        />
        {lastUpdated && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Updated {lastUpdated}
          </p>
        )}
      </div>

      {!selectedEvent && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-16 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <CalendarDays className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">
              Select an event to begin
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Choose an event from the dropdown above to view its 2D stage and
              real-time seat occupancy
            </p>
          </div>
        </div>
      )}

      {selectedEvent && (
        <>
          {seats.length > 0 && (
            <>
              <StatsBar seats={seats} />
              <OccupancyBar seats={seats} />
            </>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 2D Stage */}
            <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Stage Floor Plan
                </h2>
                <Legend />
              </div>

              {seatsQuery.isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <RefreshCw className="h-8 w-8 animate-spin" />
                    <p className="text-sm">Loading seats…</p>
                  </div>
                </div>
              ) : seats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                  <p className="text-sm font-medium text-gray-500">
                    No seats configured for this event
                  </p>
                  <p className="text-xs text-gray-400">
                    Set up seats in Stage Setup first
                  </p>
                </div>
              ) : (
                <SeatGrid seats={seats} shape={stageShape} />
              )}

              {isLive && seats.length > 0 && (
                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <p className="text-xs text-gray-400">
                    Polling every 5 seconds
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Seats;
