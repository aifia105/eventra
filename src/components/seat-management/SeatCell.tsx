import { Seat } from "@/lib/types";
import React, { useState } from "react";

const SeatCell = ({ seat }: { seat: Seat }) => {
  const [hovered, setHovered] = useState(false);

  const colorClass =
    seat.status === "reserved"
      ? "bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
      : seat.status === "locked"
        ? "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200"
        : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100";

  const pulseClass =
    seat.status === "locked"
      ? "animate-pulse"
      : seat.status === "reserved"
        ? ""
        : "";

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
                    w-7 h-7 rounded-md border flex items-center justify-center
                    text-[9px] font-semibold cursor-pointer transition-all duration-150
                    ${colorClass} ${pulseClass}
                `}
        title={`${seat.row}${seat.number}`}
      >
        {seat.number}
      </div>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-gray-900 text-white text-[10px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl">
            <p className="font-bold text-white">
              Seat {seat.row}
              {seat.number}
            </p>
            <p className="text-gray-400 capitalize">{seat.status}</p>
            {seat.reservedBy && (
              <p className="text-blue-300">{seat.reservedBy}</p>
            )}
            {seat.reservedAt && (
              <p className="text-gray-500">
                {new Date(seat.reservedAt).toLocaleTimeString()}
              </p>
            )}
            <p className="text-emerald-400">${seat.price}</p>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatCell;
