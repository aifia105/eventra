import mongoose, { Schema, Document } from "mongoose";

export type EventType = "public" | "private";

export interface IEvent extends Document {
  title: string;
  date: Date;
  location: string;
  organizer: mongoose.Types.ObjectId;
  availableSeats: number;
  type: EventType;
  stage?: mongoose.Types.ObjectId;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    availableSeats: { type: Number, required: true },
    type: { type: String, enum: ["public", "private"], required: true },
    stage: { type: Schema.Types.ObjectId, ref: "Stage" },
  },
  { timestamps: true },
);

export const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
