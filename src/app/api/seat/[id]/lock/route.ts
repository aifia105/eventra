import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Seat } from "@/models/Seat";
import { auth } from "@/lib/config/auth";
import mongoose from "mongoose";

const LOCK_DURATION_MS = 2 * 60 * 1000;

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

        await Seat.updateMany(
            { status: "locked", lockExpiresAt: { $lte: new Date() } },
            {
                $set: { status: "available" },
                $unset: { lockedBy: "", lockExpiresAt: "" },
            },
        );

        const seat = await Seat.findOneAndUpdate(
            { _id: id, status: "available" },
            {
                $set: {
                    status: "locked",
                    lockedBy: session.user.id,
                    lockExpiresAt: new Date(Date.now() + LOCK_DURATION_MS),
                },
            },
            { new: true },
        );

        if (!seat) {
            return NextResponse.json(
                { error: "Seat is not available" },
                { status: 409 },
            );
        }

        return NextResponse.json(seat);
    } catch (error) {
        console.error("Error locking seat:", error);
        return NextResponse.json(
            { error: "Failed to lock seat" },
            { status: 500 },
        );
    }
}
