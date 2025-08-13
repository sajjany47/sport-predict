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
    matchId: { type: Number, default: null },
    matchName: { type: String, default: null },
    matchType: { type: String, default: null },
    predictionTeam: { type: String, default: null },
    winnerTeam: { type: String, default: null },
    userId: Schema.Types.ObjectId,
    subscriptionId: { type: Schema.Types.ObjectId, default: null },
    subscriptionExpired: { type: Date, default: null },
    credits: { type: Number, default: null },
    paymentStatus: { type: Boolean, default: false },
    paymentId: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "refunded", "completed", "failed"],
      default: "pending",
    },
    paymentMode: {
      type: String,
      default: null,
      enum: ["UPI", "NETBANKING", "QRCODE"],
    },
    remarks: { type: String, default: null },
    paymentModeDetails: { type: Object, default: null },
    senderId: { type: Schema.Types.ObjectId, default: null },
    receiverId: { type: Schema.Types.ObjectId, default: null },
    paymentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
