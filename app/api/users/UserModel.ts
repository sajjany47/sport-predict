import mongoose, { Schema, Types } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    mobileNumber: { type: String, trim: true },
    subscriptionId: { type: Schema.Types.ObjectId },
    password: { type: String },
    username: { type: String },
    isActive: { type: Boolean, default: true },
    credits: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["admin", "user", "employee"], // 👈 Allowed roles
      default: "user", // 👈 Optional: default role
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
