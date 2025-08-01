import mongoose from "mongoose";

export const UserData = (data: any) => {
  const a = {
    name: data.name,
    email: data.email,
    mobileNumber: data.mobileNumber,
    subscriptionId: new mongoose.Types.ObjectId(data.subscriptionId),
    role: data.role,
    username: data.username,
    isActive: data.isActive,
    credits: Number(data.credits),
  };

  return a;
};
