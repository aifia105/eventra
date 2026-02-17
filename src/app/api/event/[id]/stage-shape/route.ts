import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Seat } from "@/models/Seat";
import { Event } from "@/models/Event";
import { auth } from "@/lib/config/auth";
import mongoose from "mongoose";

const ALLOWED_STAGE_SHAPES = [
  "rectangle",
  "thrust",
  "semicircle",
  "diamond",
  "amphitheater",
] as const;

type StageShape = (typeof ALLOWED_STAGE_SHAPES)[number];

export async function PATCH(
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

    const body = await req.json();
    const { rows, seatsPerRow, price, stageShape } = body || {};

    if (
      !stageShape ||
      !ALLOWED_STAGE_SHAPES.includes(stageShape) ||
      typeof rows !== "number" ||
      typeof seatsPerRow !== "number" ||
      typeof price !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid or missing stage config" },
        { status: 400 },
      );
    }

    await connectDB();

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.organizer.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Seat.updateMany(
      { eventId: id },
      {
        $set: { stageShape },
      },
    );

    await Event.findByIdAndUpdate(id, { stageShape, rows, seatsPerRow, price });

    return NextResponse.json({
      message: "Stage config updated successfully",
      stageShape,
      rows,
      seatsPerRow,
      price,
    });
  } catch (error) {
    console.error("Error updating stage shape:", error);
    return NextResponse.json(
      { error: "Failed to update stage shape" },
      { status: 500 },
    );
  }
}
