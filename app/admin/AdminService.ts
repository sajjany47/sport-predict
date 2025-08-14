import { getHeaders, getHeadersWithToken } from "@/lib/utils";
import axios from "axios";

export const StatsList = async () => {
  try {
    const response = await axios.get("/api/stats/list", {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const StatsCreate = async (payload: any) => {
  try {
    const response = await axios.post("/api/stats/create", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
export const StatsUpdate = async (payload: any) => {
  try {
    const response = await axios.post("/api/stats/update", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const StatsAutoSearch = async (payload: any) => {
  try {
    const response = await axios.post("/api/stats/search", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const OrderList = async (payload: any) => {
  try {
    const response = await axios.post("/api/order/list", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
export const OrderCreate = async (payload: any) => {
  try {
    const response = await axios.post("/api/order/list", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
export const OrderUpdate = async (payload: any) => {
  try {
    const response = await axios.post("/api/order/update", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
