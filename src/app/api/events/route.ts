import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Event } from "@/models/Event";


export async function GET() {
    try {
        await connectDB();

        const events = await Event.find({ type: "public" })
            .populate("organizer", "name")
            .sort({ date: 1 });

        const plain = events.map((doc) => ({
            id: doc._id.toString(),
            title: doc.title,
            date: doc.date.toISOString(),
            location: doc.location,
            availableSeats: doc.availableSeats,
            type: doc.type,
            organizer: doc.organizer
                ? (doc.organizer as any).name || "Unknown"
                : "Unknown",
        }));

        return NextResponse.json(plain);
    } catch (error) {
        console.error("Error fetching public events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 },
        );
    }
}
