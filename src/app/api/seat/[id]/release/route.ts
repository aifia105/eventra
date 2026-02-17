import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Seat } from "@/models/Seat";
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
            { _id: id, status: "locked", lockedBy: session.user.id },
            {
                $set: { status: "available" },
                $unset: { lockedBy: "", lockExpiresAt: "" },
            },
            { new: true },
        );

        if (!seat) {
            return NextResponse.json(
                { error: "Seat not found or not locked by you" },
                { status: 404 },
            );
        }

        return NextResponse.json(seat);
    } catch (error) {
        console.error("Error releasing seat:", error);
        return NextResponse.json(
            { error: "Failed to release seat" },
            { status: 500 },
        );
    }
}
