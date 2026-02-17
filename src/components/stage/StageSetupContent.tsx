import React, { useEffect, useState } from "react";
import SeatGridPreview from "./SeatGridPreview";
import {
  ArrowLeft,
  Columns3,
  DollarSign,
  Grid3X3,
  Loader2,
  Rows3,
} from "lucide-react";
import { LiveLayoutPreview } from "./LiveLayoutPreview";
import ShapeSelector from "./ShapeSelector";
import { StageShape } from "@/lib/types";
import { createSeats, fetchSeats, saveStageShape } from "@/lib/actions/stage";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";

const StageSetupContent = ({ eventId }: { eventId: string }) => {
  const [rows, setRows] = useState(5);
  const [seatsPerRow, setSeatsPerRow] = useState(8);
  const [price, setPrice] = useState(25);
  const [stageShape, setStageShape] = useState<StageShape>("rectangle");

  const seatsQuery = useQuery({
    queryKey: ["seats", eventId],
    queryFn: () => fetchSeats(eventId),
  });

  const mutation = useMutation({
    mutationFn: (data: {
      rows: number;
      seatsPerRow: number;
      price: number;
      stageShape: StageShape;
    }) => createSeats(eventId, data),
    onSuccess: (data) => {
      toast.success(`Created ${data.count} seats!`);
      seatsQuery.refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const saveShapeMutation = useMutation({
    mutationFn: (shape: StageShape) => saveStageShape(eventId, shape),
    onSuccess: () => {
      toast.success("Stage shape saved!");
      seatsQuery.refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const existingSeats = seatsQuery.data || [];
  const hasSeats = existingSeats.length > 0;

  const savedShape: StageShape =
    (existingSeats[0]?.stageShape as StageShape) ?? "rectangle";

  useEffect(() => {
    if (existingSeats.length > 0) {
      setStageShape(savedShape);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seatsQuery.isSuccess]);

  const shapeIsDirty = hasSeats && stageShape !== savedShape;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/org/events"
          className="flex items-center justify-center h-10 w-10 rounded-xl border bg-white hover:bg-accent/20 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stage Setup</h1>
          <p className="text-gray-500 mt-0.5">
            Define the seat layout for your event
          </p>
        </div>
      </div>

      {/* Setup Form */}
      <div className="rounded-2xl bg-white shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Grid3X3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Seat Configuration
            </h2>
            <p className="text-sm text-gray-500">
              {hasSeats
                ? "Reconfiguring will replace all existing seats"
                : "Set up your venue layout"}
            </p>
          </div>
        </div>

        {/* Stage Shape Picker */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">
            Stage Shape
          </label>
          <ShapeSelector value={stageShape} onChange={setStageShape} />
        </div>

        {/* Numeric Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Rows3 className="h-4 w-4 text-primary" />
              Number of Rows
            </label>
            <input
              type="number"
              min="1"
              max="26"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-xs text-gray-400">
              Rows A through {String.fromCharCode(64 + Math.min(rows, 26))}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Columns3 className="h-4 w-4 text-primary" />
              Seats per Row
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={seatsPerRow}
              onChange={(e) => setSeatsPerRow(Number(e.target.value))}
              className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Price per Seat
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Live preview before save */}
        <LiveLayoutPreview
          rows={rows}
          seatsPerRow={seatsPerRow}
          shape={stageShape}
        />

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Total seats:{" "}
            <span className="font-semibold text-gray-900">
              {rows * seatsPerRow}
            </span>{" "}
            <span className="text-gray-400">(varies by shape)</span>
          </p>
          <button
            onClick={() =>
              mutation.mutate({ rows, seatsPerRow, price, stageShape })
            }
            disabled={mutation.isPending}
            className="inline-flex items-center justify-center rounded-xl text-sm font-semibold h-12 px-8 bg-primary text-white hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : hasSeats ? (
              "Reconfigure Seats"
            ) : (
              "Create Seats"
            )}
          </button>
        </div>
      </div>

      {/* Saved seat preview */}
      {hasSeats && (
        <SeatGridPreview
          existingSeats={existingSeats}
          stageShape={savedShape}
          pendingShape={stageShape}
          shapeIsDirty={shapeIsDirty}
          onSaveShape={() => saveShapeMutation.mutate(stageShape)}
          isSavingShape={saveShapeMutation.isPending}
        />
      )}
    </div>
  );
};

export default StageSetupContent;
