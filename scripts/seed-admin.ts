import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/eventra";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "org", "client"] },
  },
  { timestamps: true },
);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const User = mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email: "admin@eventra.com" });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashed = await bcrypt.hash("admin123", 10);
  await User.create({
    name: "Admin",
    email: "admin@eventra.com",
    password: hashed,
    role: "admin",
  });

  console.log("Admin created: admin@eventra.com / admin123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
