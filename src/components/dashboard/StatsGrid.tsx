"use client";

import React from "react";
import { Ticket, MapPin, Users, Globe, Calendar } from "lucide-react";
import { EventData } from "./event-selector";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  gradient: string;
  percentage?: string;
  trend?: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  percentage,
  trend,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-accent/10 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {(percentage || trend) && (
            <div className="flex items-center gap-2 text-xs">
              {percentage && (
                <span className="text-gray-500">{percentage}</span>
              )}
              {trend && (
                <span className="text-green-600 font-medium">{trend}</span>
              )}
            </div>
          )}
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br ${gradient} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  event?: EventData;
}

const StatsGrid = ({ event }: StatsGridProps) => {
  if (!event) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Events"
          value="—"
          icon={Ticket}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          label="Available Seats"
          value="—"
          icon={Users}
          gradient="from-indigo-500 to-indigo-600"
        />
        <StatCard
          label="Location"
          value="—"
          icon={MapPin}
          gradient="from-purple-500 to-purple-600"
        />
        <StatCard
          label="Event Type"
          value="—"
          icon={Globe}
          gradient="from-green-500 to-green-600"
        />
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Event Date"
        value={formattedDate}
        icon={Calendar}
        gradient="from-blue-500 to-blue-600"
      />
      <StatCard
        label="Available Seats"
        value={event.availableSeats.toLocaleString()}
        icon={Users}
        gradient="from-indigo-500 to-indigo-600"
      />
      <StatCard
        label="Location"
        value={event.location}
        icon={MapPin}
        gradient="from-purple-500 to-purple-600"
      />
      <StatCard
        label="Event Type"
        value={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        icon={Globe}
        gradient="from-green-500 to-green-600"
      />
    </div>
  );
};

export default StatsGrid;
