import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Seat } from "@/models/Seat";
import { Event } from "@/models/Event";
import { auth } from "@/lib/config/auth";
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

    await Seat.updateMany(
      {
        eventId: id,
        status: "locked",
        lockExpiresAt: { $lte: new Date() },
      },
      {
        $set: { status: "available" },
        $unset: { lockedBy: "", lockExpiresAt: "" },
      },
    );

    const seats = await Seat.find({ eventId: id }).sort({ row: 1, number: 1 });
    return NextResponse.json(seats);
  } catch (error) {
    console.error("Error fetching seats:", error);
    return NextResponse.json(
      { error: "Failed to fetch seats" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "org") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    await connectDB();

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.organizer.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { rows, seatsPerRow, price, stageShape } = await req.json();

    if (!rows || !seatsPerRow || !price) {
      return NextResponse.json(
        { error: "rows, seatsPerRow, and price are required" },
        { status: 400 },
      );
    }

    await Seat.deleteMany({ eventId: id });

    const seats = [];
    for (let r = 0; r < rows; r++) {
      const rowLetter = String.fromCharCode(65 + r);
      for (let s = 1; s <= seatsPerRow; s++) {
        const seatData: Record<string, unknown> = {
          eventId: id,
          row: rowLetter,
          number: s,
          price,
          status: "available",
        };

        if (stageShape) {
          seatData.stageShape = stageShape;
        }

        seats.push(seatData);
      }
    }

    const created = await Seat.insertMany(seats);

    await Event.findByIdAndUpdate(id, {
      availableSeats: created.length,
      ...(stageShape && { stageShape }),
    });

    return NextResponse.json(
      { message: `Created ${created.length} seats`, count: created.length },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating seats:", error);
    return NextResponse.json(
      { error: "Failed to create seats" },
      { status: 500 },
    );
  }
}
