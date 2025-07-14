import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    orderNumber: String,
    ordertype: {
      type: String,
      enum: ["subscription", "prediction", "credit"],
      default: "subscription",
    },
    price: { type: Number, default: null },
    userId: Schema.Types.ObjectId,
    subscriptionId: { type: Schema.Types.ObjectId, default: null },
    subscriptionExpired: { type: Date, default: null },
    credits: { type: Number, default: null },
    paymentStatus: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "verified", "completed", "failed"],
      default: "pending",
    },
    paymentId: { type: String, default: null },
    paymentMode: {
      type: String,
      default: null,
      enum: ["UPI", "NETBANKING", "CARD", "OFFLINE"],
    },
    senderId: { type: String, default: null },
    receiverId: { type: String, default: null },
    paymentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
