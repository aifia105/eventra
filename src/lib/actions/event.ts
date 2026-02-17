import { connectDB } from "@/lib/config/db";
import { Event as EventModel } from "@/models/Event";
import { auth } from "@/lib/config/auth";

export async function getOrgEvents() {
  const session = await auth();
  if (!session || session.user.role !== "org") {
    throw new Error("Unauthorized");
  }

  await connectDB();

  const events = await EventModel.find({ organizer: session.user.id }).sort({
    createdAt: -1,
  });

  return events.map((doc) => ({
    id: doc._id.toString(),
    name: doc.title,
    organizer: doc.organizer.toString(),
    date: doc.date.toISOString(),
    location: doc.location,
    availableSeats: doc.availableSeats,
    type: doc.type,
    stageShape: doc.stageShape,
  }));
}
