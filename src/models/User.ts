import mongoose, { Schema, Document } from "mongoose";

export type Role = "admin" | "org" | "client";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "org", "client"], default: "client" },
  },
  { timestamps: true },
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
