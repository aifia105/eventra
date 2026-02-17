import { Seat } from "@/lib/types";
import React from "react";

const OccupancyBar = ({ seats }: { seats: Seat[] }) => {
  const total = seats.length || 1;
  const reservedPct =
    (seats.filter((s) => s.status === "reserved").length / total) * 100;
  const lockedPct =
    (seats.filter((s) => s.status === "locked").length / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
        <span>Occupancy</span>
        <span>{Math.round(reservedPct + lockedPct)}% occupied</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden flex">
        <div
          className="h-full bg-red-400 transition-all duration-500"
          style={{ width: `${reservedPct}%` }}
        />
        <div
          className="h-full bg-amber-300 transition-all duration-500"
          style={{ width: `${lockedPct}%` }}
        />
      </div>
    </div>
  );
};

export default OccupancyBar;
