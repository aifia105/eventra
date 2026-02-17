import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Seat } from "@/models/Seat";
import { Reservation } from "@/models/Reservation";
import { auth } from "@/lib/config/auth";
import mongoose from "mongoose";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid seat ID" }, { status: 400 });
        }

        await connectDB();

        const seat = await Seat.findOneAndUpdate(
            {
                _id: id,
                status: "locked",
                lockedBy: session.user.id,
                lockExpiresAt: { $gt: new Date() },
            },
            {
                $set: { status: "reserved" },
                $unset: { lockedBy: "", lockExpiresAt: "" },
            },
            { new: true },
        );

        if (!seat) {
            return NextResponse.json(
                { error: "Seat lock expired or not found" },
                { status: 409 },
            );
        }

        const reservation = await Reservation.create({
            userId: session.user.id,
            eventId: seat.eventId,
            seatId: seat._id,
            status: "confirmed",
        });

        return NextResponse.json({ seat, reservation });
    } catch (error) {
        console.error("Error confirming seat:", error);
        return NextResponse.json(
            { error: "Failed to confirm reservation" },
            { status: 500 },
        );
    }
}
