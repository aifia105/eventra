"use client";

import { useState } from "react";
import {
  EventSelector,
  EventData,
} from "@/components/dashboard/event-selector";
import StatsGrid from "@/components/dashboard/StatsGrid";
import { ShoppingCart, TrendingUp } from "lucide-react";

interface OrgDashboardClientProps {
  events: EventData[];
}

export default function OrgDashboardClient({
  events,
}: OrgDashboardClientProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventData>(events[0]);

  return (
    <>
      {events.length > 0 ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Viewing:</span>
          <EventSelector events={events} onSelect={setSelectedEvent} />
        </div>
      ) : (
        <div className="text-gray-500 text-sm">
          No events found. Create your first event to get started.
        </div>
      )}

      <StatsGrid event={selectedEvent} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-accent/10 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Sales Overview
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-lg">
                7D
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                30D
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                90D
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No sales data available</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-accent/10 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Activity
          </h2>
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
