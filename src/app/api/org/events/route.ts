import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Event as EventModel } from "@/models/Event";
import { auth } from "@/lib/config/auth";

export async function GET() {
    try {
        const session = await auth();

        if (!session || session.user.role !== "org") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const events = await EventModel.find({ organizer: session.user.id }).sort({
            createdAt: -1,
        });

        const shapedEvents = events.map((doc) => ({
            _id: doc._id.toString(),
            name: doc.title,
            date: doc.date.toISOString(),
            venue: doc.location,
        }));

        return NextResponse.json(shapedEvents);
    } catch (error) {
        console.error("Error fetching org events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 },
        );
    }
}

