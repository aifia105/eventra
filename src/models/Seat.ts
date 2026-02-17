import mongoose, { Schema, Document } from "mongoose";

export type SeatStatus = "available" | "locked" | "reserved";

export interface ISeat extends Document {
    eventId: mongoose.Types.ObjectId;
    row: string;
    number: number;
    price: number;
    status: SeatStatus;
    lockedBy?: mongoose.Types.ObjectId;
    lockExpiresAt?: Date;
}

const SeatSchema = new Schema<ISeat>(
    {
        eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        row: { type: String, required: true },
        number: { type: Number, required: true },
        price: { type: Number, required: true },
        status: {
            type: String,
            enum: ["available", "locked", "reserved"],
            default: "available",
        },
        lockedBy: { type: Schema.Types.ObjectId, ref: "User" },
        lockExpiresAt: { type: Date },
    },
    { timestamps: true },
);

SeatSchema.index({ eventId: 1, row: 1, number: 1 }, { unique: true });

export const Seat =
    mongoose.models.Seat || mongoose.model<ISeat>("Seat", SeatSchema);
