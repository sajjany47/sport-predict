import mongoose from "mongoose";

function generateOrderNumber() {
  const now = new Date();

  // Format parts
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 01-12
  const day = String(now.getDate()).padStart(2, "0"); // 01-31
  const hours = String(now.getHours()).padStart(2, "0"); // 00-23
  const minutes = String(now.getMinutes()).padStart(2, "0"); // 00-59

  // Random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000);

  // Final format: ORD-YYYYMMDD-HHMM-RAND
  return `${year}${month}${day}${hours}${minutes}${random}`;
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

    paymentStatus:
      formData.ordertype === "credit" ? true : formData.paymentStatus ?? false,

    status:
      formData.ordertype === "credit"
        ? "completed"
        : formData.status || "pending",

    paymentId: formData.paymentId || null,

    paymentMode: formData.paymentMode || null,

    paymentModeDetails: formData.paymentModeDetails || null,

    // senderId: formData.senderId || null,

    receiverId: new mongoose.Types.ObjectId(formData.receiverId) || null,

    paymentDate: formData.paymentDate ? new Date(formData.paymentDate) : null,

    matchId: formData.matchId ? Number(formData.matchId) : null,
  };
}
