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
    subscription: [
      {
        subscriptionId: Schema.Types.ObjectId,
        isActive: Boolean,
        expiryDate: Date,
        purchaseDate: Date,
      },
    ],
    password: { type: String },
    username: { type: String },
    isActive: { type: Boolean, default: true },
    agreeToTerms: { type: Boolean, default: false },
    credits: { type: Number, default: 0 },
    lastAdCreditDate: {
      type: Date,
      default: null,
    },
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
