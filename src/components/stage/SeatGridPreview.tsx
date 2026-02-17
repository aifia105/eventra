import { StageShape } from "@/lib/types";
import React from "react";
import StagePreview from "./StagePreview";
import { Check, LayoutTemplate, Loader2 } from "lucide-react";

const SeatGridPreview = ({
  existingSeats,
  stageShape,
  pendingShape,
  shapeIsDirty,
  onSaveShape,
  isSavingShape,
}: {
  existingSeats: any[];
  stageShape: StageShape;
  pendingShape: StageShape;
  shapeIsDirty: boolean;
  onSaveShape: () => void;
  isSavingShape: boolean;
}) => {
  const seatsByRow: Record<string, any[]> = {};
  existingSeats.forEach((seat: any) => {
    if (!seatsByRow[seat.row]) seatsByRow[seat.row] = [];
    seatsByRow[seat.row].push(seat);
  });
  const sortedRows = Object.keys(seatsByRow).sort();

  const statusColor = (status: string) => {
    if (status === "reserved") return "bg-red-100 border-red-300 text-red-700";
    if (status === "locked")
      return "bg-amber-100 border-amber-300 text-amber-700";
    return "bg-green-100 border-green-300 text-green-700";
  };

  const displayShape = shapeIsDirty ? pendingShape : stageShape;

  return (
    <div className="rounded-2xl bg-white shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Seat Preview</h2>
          {shapeIsDirty && (
            <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
              <LayoutTemplate className="h-3 w-3" />
              Shape changed — save to apply to this event
            </p>
          )}
        </div>

        {shapeIsDirty && (
          <button
            onClick={onSaveShape}
            disabled={isSavingShape}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {isSavingShape ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Stage Shape
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center">
        <StagePreview shape={displayShape} />
        <div className="flex flex-col items-center gap-1.5">
          {sortedRows.map((row) => {
            const seats = seatsByRow[row].sort(
              (a: any, b: any) => a.number - b.number,
            );
            return (
              <div key={row} className="flex items-center gap-2">
                <span className="w-6 text-xs font-semibold text-gray-400 text-right">
                  {row}
                </span>
                <div className="flex gap-1">
                  {seats.map((seat: any) => (
                    <div
                      key={seat._id}
                      title={`${seat.row}${seat.number} · $${seat.price} · ${seat.status ?? "available"}`}
                      className={`w-7 h-7 rounded-md border flex items-center justify-center text-[9px] font-medium transition-colors ${statusColor(seat.status ?? "available")}`}
                    >
                      {seat.number}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 mt-6 text-xs text-gray-500">
        {[
          { color: "bg-green-100 border-green-300", label: "Available" },
          { color: "bg-amber-100 border-amber-300", label: "Locked" },
          { color: "bg-red-100 border-red-300", label: "Reserved" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-4 h-4 rounded border ${color}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatGridPreview;
