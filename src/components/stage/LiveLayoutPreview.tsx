import { StageShape } from "@/lib/types";
import React from "react";
import StagePreview from "./StagePreview";
import { getSeatsForRow } from "@/lib/actions/stage";

export const LiveLayoutPreview = ({
  rows,
  seatsPerRow,
  shape,
}: {
  rows: number;
  seatsPerRow: number;
  shape: StageShape;
}) => {
  const rowLabels = Array.from({ length: rows }, (_, i) =>
    String.fromCharCode(65 + i),
  );

  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">
        Live Preview
      </p>
      <StagePreview shape={shape} />
      <div className="flex flex-col items-center gap-1 overflow-x-auto mr-5">
        {rowLabels.map((row, rowIdx) => {
          const count = getSeatsForRow(rowIdx, rows, seatsPerRow, shape);
          return (
            <div key={row} className="flex items-center gap-1.5">
              <span className="w-5 text-[10px] font-semibold text-gray-400 text-right">
                {row}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: count }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-sm bg-green-200 border border-green-300"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
