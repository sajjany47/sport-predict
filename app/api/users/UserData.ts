import mongoose from "mongoose";

export const UserData = (data: any) => {
  const a = {
    name: data.name,
    email: data.email,
    mobileNumber: data.mobileNumber,
    subscription: data.subscription,
    role: data.role,
    username: data.username,
    isActive: data.isActive,
    credits: Number(data.credits),
    agreeToTerms: data.agreeToTerms,
  };

  return a;
};
