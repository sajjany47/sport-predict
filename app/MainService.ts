import privateApi from "@/lib/privateAxiosClient";
import publicApi from "@/lib/publicAxiosClient";
import { getHeadersWithToken } from "@/lib/utils";
import axios from "axios";

export const SubscriptionCreate = async (payload: any) => {
  try {
    const response = await privateApi.post(
      "/api/subscription/create",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
export const SubscriptionUpdate = async (payload: any) => {
  try {
    const response = await privateApi.post(
      "/api/subscription/update",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const SubscriptionList = async () => {
  try {
    const response = await publicApi.get("/api/subscription/list", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserLogin = async (payload: any) => {
  try {
    const response = await publicApi.post("/api/users/sigin", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserRegister = async (payload: any) => {
  try {
    const response = await publicApi.post("/api/users/signup", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserCreditUpdate = async (payload: any) => {
  try {
    const response = await privateApi.post(
      "/api/users/credit-update",
      payload,
      {
        headers: getHeadersWithToken(),
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserOrderCredit = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/order/create", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
