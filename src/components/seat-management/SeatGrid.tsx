import { Seat, StageShape } from "@/lib/types";
import React from "react";
import SeatCell from "./SeatCell";
import StagePreview from "../stage/StagePreview";

const SeatGrid = ({ seats, shape }: { seats: Seat[]; shape: StageShape }) => {
  const seatsByRow: Record<string, Seat[]> = {};
  seats.forEach((seat) => {
    if (!seatsByRow[seat.row]) seatsByRow[seat.row] = [];
    seatsByRow[seat.row].push(seat);
  });
  const sortedRows = Object.keys(seatsByRow).sort();

  return (
    <div className="overflow-x-auto">
      <StagePreview shape={shape} />
      <div className="flex flex-col items-center gap-1.5">
        {sortedRows.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-6 text-[10px] font-bold text-gray-400 text-right shrink-0">
              {row}
            </span>
            <div className="flex gap-1">
              {seatsByRow[row]
                .sort((a, b) => a.number - b.number)
                .map((seat) => (
                  <SeatCell key={seat._id} seat={seat} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatGrid;
