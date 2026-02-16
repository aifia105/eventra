import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Event } from "@/models/Event";
import { auth } from "@/lib/config/auth";
import { eventSchema } from "@/lib/validations/event";

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find()
      .populate("organizer", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session.user as any).role !== "org") {
      return NextResponse.json(
        { error: "Only organizations can create events" },
        { status: 403 },
      );
    }

    const body = await req.json();

    const validation = eventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();

    const newEvent = await Event.create({
      ...validation.data,
      organizer: session.user.id,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
