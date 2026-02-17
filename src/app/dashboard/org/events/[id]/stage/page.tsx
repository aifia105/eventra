"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Grid3X3, Loader2, DollarSign, Rows3, Columns3 } from "lucide-react";

interface StageSetupPageProps {
    params: Promise<{ id: string }>;
}

async function fetchSeats(eventId: string) {
    const res = await fetch(`/api/event/${eventId}/seats`);
    if (!res.ok) throw new Error("Failed to fetch seats");
    return res.json();
}

async function createSeats(
    eventId: string,
    data: { rows: number; seatsPerRow: number; price: number },
) {
    const res = await fetch(`/api/event/${eventId}/seats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create seats");
    }
    return res.json();
}

export default function StageSetupPage({ params }: StageSetupPageProps) {
    const [eventId, setEventId] = useState<string | null>(null);
    const [rows, setRows] = useState(5);
    const [seatsPerRow, setSeatsPerRow] = useState(8);
    const [price, setPrice] = useState(25);
    const router = useRouter();

    if (!eventId) {
        params.then((p) => setEventId(p.id));
        return null;
    }

    return <StageSetupContent eventId={eventId} />;
}

function StageSetupContent({ eventId }: { eventId: string }) {
    const [rows, setRows] = useState(5);
    const [seatsPerRow, setSeatsPerRow] = useState(8);
    const [price, setPrice] = useState(25);

    const seatsQuery = useQuery({
        queryKey: ["seats", eventId],
        queryFn: () => fetchSeats(eventId),
    });

    const mutation = useMutation({
        mutationFn: (data: { rows: number; seatsPerRow: number; price: number }) =>
            createSeats(eventId, data),
        onSuccess: (data) => {
            toast.success(`Created ${data.count} seats!`);
            seatsQuery.refetch();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const existingSeats = seatsQuery.data || [];
    const hasSeats = existingSeats.length > 0;


    const seatsByRow: Record<string, any[]> = {};
    existingSeats.forEach((seat: any) => {
        if (!seatsByRow[seat.row]) seatsByRow[seat.row] = [];
        seatsByRow[seat.row].push(seat);
    });
    const sortedRows = Object.keys(seatsByRow).sort();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-8">
                <Link
                    href="/dashboard/org/events"
                    className="flex items-center justify-center h-10 w-10 rounded-xl border bg-white hover:bg-accent/20 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Stage Setup</h1>
                    <p className="text-gray-500 mt-1">
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

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Total seats: <span className="font-semibold text-gray-900">{rows * seatsPerRow}</span>
                    </p>
                    <button
                        onClick={() => mutation.mutate({ rows, seatsPerRow, price })}
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

            {/* Seat Preview */}
            {hasSeats && (
                <div className="rounded-2xl bg-white shadow-sm p-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Seat Preview
                    </h2>

                    {/* Stage indicator */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-800 text-white text-sm font-medium px-16 py-3 rounded-t-2xl">
                            STAGE
                        </div>
                    </div>

                    {/* Seat grid */}
                    <div className="flex flex-col items-center gap-2">
                        {sortedRows.map((row) => (
                            <div key={row} className="flex items-center gap-2">
                                <span className="w-6 text-xs font-semibold text-gray-500 text-right">
                                    {row}
                                </span>
                                <div className="flex gap-1.5">
                                    {seatsByRow[row]
                                        .sort((a: any, b: any) => a.number - b.number)
                                        .map((seat: any) => (
                                            <div
                                                key={seat._id}
                                                className="w-8 h-8 rounded-lg bg-green-100 border border-green-300 flex items-center justify-center text-[10px] font-medium text-green-700"
                                                title={`${seat.row}${seat.number} - $${seat.price}`}
                                            >
                                                {seat.number}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300" />
                            <span>Locked</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
                            <span>Reserved</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
