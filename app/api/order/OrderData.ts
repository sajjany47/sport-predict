import mongoose from "mongoose";

function generateOrderNumber() {
  const now = new Date();
  return `ORD-${now.getFullYear()}${
    now.getMonth() + 1
  }${now.getDate()}-${Math.floor(Math.random() * 100000)}`;
}
export function PrepareOrderData(formData: any, isEdit = false) {
  return {
    orderNumber:
      formData.orderNumber || (isEdit ? undefined : generateOrderNumber()),

    ordertype: formData.ordertype || "subscription",

    price: formData.price !== undefined ? Number(formData.price) : null,

    userId: new mongoose.Types.ObjectId(formData.userId),

    subscriptionId:
      new mongoose.Types.ObjectId(formData.subscriptionId) || null,

    subscriptionExpired: formData.subscriptionExpired
      ? new Date(formData.subscriptionExpired)
      : null,

    credits: formData.credits !== undefined ? Number(formData.credits) : null,

    paymentStatus: formData.paymentStatus ?? false,

    status: formData.status || "pending",

    paymentId: formData.paymentId || null,

    paymentMode: formData.paymentMode || null,

    paymentModeDetails: formData.paymentModeDetails || null,

    // senderId: formData.senderId || null,

    receiverId: new mongoose.Types.ObjectId(formData.receiverId) || null,

    paymentDate: formData.paymentDate ? new Date(formData.paymentDate) : null,

    matchId: formData.matchId ? Number(formData.matchId) : null,
    matchName: formData.matchName ?? null,
    matchType: formData.matchType ?? null,
    predictionTeam: formData.predictionTeam ?? null,
    winnerTeam: formData.winnerTeam ?? null,
  };
}
