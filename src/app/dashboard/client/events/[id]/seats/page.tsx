"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Loader2,
    Check,
    X,
    Timer,
} from "lucide-react";

interface Seat {
    _id: string;
    row: string;
    number: number;
    price: number;
    status: "available" | "locked" | "reserved";
    lockedBy?: string;
    lockExpiresAt?: string;
}

interface EventInfo {
    _id: string;
    title: string;
    date: string;
    location: string;
}

interface SeatMapPageProps {
    params: Promise<{ id: string }>;
}

export default function SeatMapPage({ params }: SeatMapPageProps) {
    const [eventId, setEventId] = useState<string | null>(null);

    if (!eventId) {
        params.then((p) => setEventId(p.id));
        return null;
    }

    return <SeatMapContent eventId={eventId} />;
}

function SeatMapContent({ eventId }: { eventId: string }) {
    const [lockedSeat, setLockedSeat] = useState<Seat | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const queryClient = useQueryClient();

    // Fetch event info
    const eventQuery = useQuery({
        queryKey: ["event", eventId],
        queryFn: async () => {
            const res = await fetch(`/api/event/${eventId}`);
            if (!res.ok) throw new Error("Failed to fetch event");
            return res.json() as Promise<EventInfo>;
        },
    });

    // Fetch seats with polling
    const seatsQuery = useQuery({
        queryKey: ["seats", eventId],
        queryFn: async () => {
            const res = await fetch(`/api/event/${eventId}/seats`);
            if (!res.ok) throw new Error("Failed to fetch seats");
            return res.json() as Promise<Seat[]>;
        },
        refetchInterval: 5000,
    });

    // Lock mutation
    const lockMutation = useMutation({
        mutationFn: async (seatId: string) => {
            const res = await fetch(`/api/seat/${seatId}/lock`, { method: "POST" });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to lock seat");
            }
            return res.json() as Promise<Seat>;
        },
        onSuccess: (seat) => {
            setLockedSeat(seat);
            setTimeLeft(120);
            queryClient.invalidateQueries({ queryKey: ["seats", eventId] });
            toast.success(`Seat ${seat.row}${seat.number} locked! Confirm within 2 minutes.`);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    // Confirm mutation
    const confirmMutation = useMutation({
        mutationFn: async (seatId: string) => {
            const res = await fetch(`/api/seat/${seatId}/confirm`, {
                method: "POST",
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to confirm");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success("Seat reserved successfully!");
            setLockedSeat(null);
            setTimeLeft(0);
            queryClient.invalidateQueries({ queryKey: ["seats", eventId] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    // Release mutation
    const releaseMutation = useMutation({
        mutationFn: async (seatId: string) => {
            const res = await fetch(`/api/seat/${seatId}/release`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed to release");
            return res.json();
        },
        onSuccess: () => {
            toast("Seat released", { icon: "🔓" });
            setLockedSeat(null);
            setTimeLeft(0);
            queryClient.invalidateQueries({ queryKey: ["seats", eventId] });
        },
    });

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) {
            if (lockedSeat) {
                setLockedSeat(null);
                queryClient.invalidateQueries({ queryKey: ["seats", eventId] });
                toast.error("Lock expired! Seat released.");
            }
            return;
        }
        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, lockedSeat, eventId, queryClient]);

    const handleSeatClick = useCallback(
        (seat: Seat) => {
            if (lockedSeat) {
                toast.error("You already have a seat locked. Confirm or cancel first.");
                return;
            }
            if (seat.status !== "available") return;
            lockMutation.mutate(seat._id);
        },
        [lockedSeat, lockMutation],
    );

    const seats = seatsQuery.data || [];
    const seatsByRow: Record<string, Seat[]> = {};
    seats.forEach((seat) => {
        if (!seatsByRow[seat.row]) seatsByRow[seat.row] = [];
        seatsByRow[seat.row].push(seat);
    });
    const sortedRows = Object.keys(seatsByRow).sort();

    const event = eventQuery.data;
    const formatMins = (s: number) =>
        `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-8">
                <Link
                    href="/dashboard/client/events"
                    className="flex items-center justify-center h-10 w-10 rounded-xl border bg-white hover:bg-accent/20 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {event?.title || "Loading..."}
                    </h1>
                    {event && (
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(event.date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {event.location}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Lock Panel */}
            {lockedSeat && (
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                                <Timer className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    Seat {lockedSeat.row}
                                    {lockedSeat.number} locked
                                </p>
                                <p className="text-sm text-gray-600">
                                    ${lockedSeat.price} · Expires in{" "}
                                    <span className="font-mono font-semibold text-amber-700">
                                        {formatMins(timeLeft)}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => releaseMutation.mutate(lockedSeat._id)}
                                disabled={releaseMutation.isPending}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmMutation.mutate(lockedSeat._id)}
                                disabled={confirmMutation.isPending}
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-all shadow-sm"
                            >
                                {confirmMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4" />
                                )}
                                Confirm Reservation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Seat Map */}
            <div className="rounded-2xl bg-white shadow-sm p-8">
                {seatsQuery.isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : seats.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg font-medium">
                            No seats configured for this event yet
                        </p>
                        <p className="text-sm mt-1">
                            The organizer hasn&apos;t set up the stage layout
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Stage */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-gray-800 text-white text-sm font-medium px-16 py-3 rounded-t-2xl">
                                STAGE
                            </div>
                        </div>

                        {/* Seats Grid */}
                        <div className="flex flex-col items-center gap-2 overflow-x-auto">
                            {sortedRows.map((row) => (
                                <div key={row} className="flex items-center gap-2">
                                    <span className="w-6 text-xs font-semibold text-gray-500 text-right shrink-0">
                                        {row}
                                    </span>
                                    <div className="flex gap-1.5">
                                        {seatsByRow[row]
                                            .sort((a, b) => a.number - b.number)
                                            .map((seat) => {
                                                const isMyLock =
                                                    lockedSeat && lockedSeat._id === seat._id;
                                                let bg = "";
                                                let border = "";
                                                let text = "";
                                                let cursor = "cursor-default";

                                                if (seat.status === "available") {
                                                    bg = "bg-green-100 hover:bg-green-200";
                                                    border = "border-green-300";
                                                    text = "text-green-700";
                                                    cursor = "cursor-pointer";
                                                } else if (seat.status === "locked") {
                                                    bg = isMyLock
                                                        ? "bg-amber-200 ring-2 ring-amber-400"
                                                        : "bg-amber-100";
                                                    border = "border-amber-300";
                                                    text = "text-amber-700";
                                                } else {
                                                    bg = "bg-red-100";
                                                    border = "border-red-300";
                                                    text = "text-red-700";
                                                }

                                                return (
                                                    <button
                                                        key={seat._id}
                                                        onClick={() => handleSeatClick(seat)}
                                                        disabled={
                                                            seat.status !== "available" ||
                                                            lockMutation.isPending
                                                        }
                                                        className={`w-9 h-9 rounded-lg border flex items-center justify-center text-[10px] font-medium transition-all duration-150 ${bg} ${border} ${text} ${cursor} disabled:cursor-not-allowed`}
                                                        title={`${seat.row}${seat.number} · $${seat.price} · ${seat.status}`}
                                                    >
                                                        {seat.number}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-6 mt-8 text-xs text-gray-500">
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
                    </>
                )}
            </div>
        </div>
    );
}
