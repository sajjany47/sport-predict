import mongoose, { Schema, Types } from "mongoose";
const SupportSchema = new Schema(
  {
    userId: Schema.Types.ObjectId,
    subject: String,
    description: String,
    status: {
      type: String,
      enum: ["in-progress", "resolved", "open"],
      default: "in-progress",
    },
    responseBy: Schema.Types.ObjectId,
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
  mongoose.models.User || mongoose.model("SupportTicket", SupportSchema);
export default SupportTicket;
