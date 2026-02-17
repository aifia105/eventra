import mongoose, { Schema, Document } from "mongoose";

export type ReservationStatus = "pending" | "confirmed";

export interface IReservation extends Document {
    userId: mongoose.Types.ObjectId;
    eventId: mongoose.Types.ObjectId;
    seatId: mongoose.Types.ObjectId;
    status: ReservationStatus;
}

const ReservationSchema = new Schema<IReservation>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        seatId: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed"],
            default: "confirmed",
        },
    },
    { timestamps: true },
);

ReservationSchema.index({ seatId: 1 }, { unique: true });

export const Reservation =
    mongoose.models.Reservation ||
    mongoose.model<IReservation>("Reservation", ReservationSchema);
