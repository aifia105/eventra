import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Event } from "@/models/Event";
import mongoose from "mongoose";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
        }

        await connectDB();

        const event = await Event.findById(id).populate("organizer", "name email");

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json(
            { error: "Failed to fetch event" },
            { status: 500 },
        );
    }
}
