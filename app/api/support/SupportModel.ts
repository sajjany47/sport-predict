import mongoose, { Schema, Types } from "mongoose";
const SupportSchema = new Schema(
  {
    userId: Schema.Types.ObjectId,
    category: String,
    subject: String,
    description: String,
    ticketNumber: String,
    status: {
      type: String,
      enum: ["in-progress", "resolved", "open"],
      default: "in-progress",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "low",
    },
    message: [
      {
        text: String,
        replyAt: Date,
        replyBy: Schema.Types.ObjectId,
        ticketStatus: {
          type: String,
          enum: ["in-progress", "resolved", "open"],
          default: "in-progress",
        },
      },
    ],
  },
  { timestamps: true }
);

const SupportTicket =
  mongoose.models.SupportTicket ||
  mongoose.model("SupportTicket", SupportSchema);
export default SupportTicket;
