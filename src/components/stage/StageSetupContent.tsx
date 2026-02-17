import React, { useEffect, useState } from "react";
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
import { fetchEvent } from "@/lib/actions/event-single";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";

const StageSetupContent = ({ eventId }: { eventId: string }) => {
  const [rows, setRows] = useState(1);
  const [seatsPerRow, setSeatsPerRow] = useState(1);
  const [price, setPrice] = useState(25);
  const [stageShape, setStageShape] = useState<StageShape>("rectangle");
  const [eventLoaded, setEventLoaded] = useState(false);
  const [maxSeats, setMaxSeats] = useState(0);

  const seatsQuery = useQuery({
    queryKey: ["seats", eventId],
    queryFn: () => fetchSeats(eventId),
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      rows: number;
      seatsPerRow: number;
      price: number;
      stageShape: StageShape;
    }) => {
      await saveStageShape(eventId, {
        rows: data.rows,
        seatsPerRow: data.seatsPerRow,
        price: data.price,
        stageShape: data.stageShape,
      });
      return createSeats(eventId, data);
    },
    onSuccess: (data) => {
      toast.success(`Created ${data.count} seats!`);
      seatsQuery.refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!maxSeats) return;
    setRows((r) => Math.min(r, Math.min(26, maxSeats)));
    setSeatsPerRow((s) => Math.min(s, Math.min(50, maxSeats)));
  }, [maxSeats]);

  const maxRowsAllowed = maxSeats
    ? Math.min(26, Math.floor(maxSeats / Math.max(seatsPerRow, 1)))
    : 26;

  const maxSeatsPerRowAllowed = maxSeats
    ? Math.min(50, Math.floor(maxSeats / Math.max(rows, 1)))
    : 50;

  const existingSeats = seatsQuery.data || [];
  const hasSeats = existingSeats.length > 0;

  useEffect(() => {
    fetchEvent(eventId)
      .then((event) => {
        if (event.stageShape) setStageShape(event.stageShape);
      })
      .finally(() => setEventLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  if (!eventLoaded) return null;

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Math.max(1, Number(e.target.value)), maxRowsAllowed);
    setRows(val);
    if (maxSeats) {
      const newMax = Math.min(50, Math.floor(maxSeats / val));
      setSeatsPerRow((s) => Math.min(s, newMax));
    }
  };

  const handleSeatsPerRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(
      Math.max(1, Number(e.target.value)),
      maxSeatsPerRowAllowed,
    );
    setSeatsPerRow(val);
    if (maxSeats) {
      const newMax = Math.min(26, Math.floor(maxSeats / val));
      setRows((r) => Math.min(r, newMax));
    }
  };

  return (
    <div className="space-y-6">
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

        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">
            Stage Shape
          </label>
          <ShapeSelector value={stageShape} onChange={setStageShape} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Rows3 className="h-4 w-4 text-primary" />
              Number of Rows
            </label>
            <input
              type="number"
              min="1"
              max={maxRowsAllowed}
              value={rows}
              onChange={handleRowsChange}
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
              max={maxSeatsPerRowAllowed}
              value={seatsPerRow}
              onChange={handleSeatsPerRowChange}
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
    </div>
  );
};

export default StageSetupContent;
