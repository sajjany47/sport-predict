import mongoose, { Schema, Document, Model } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    credits: { type: Number, required: true },
    features: { type: [String], default: [] },
    popular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
