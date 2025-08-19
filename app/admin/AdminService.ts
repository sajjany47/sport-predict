import privateApi from "@/lib/privateAxiosClient";
import { getHeaders, getHeadersWithToken } from "@/lib/utils";

export const StatsList = async () => {
  try {
    const response = await privateApi.get("/api/stats/list", {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const StatsCreate = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/stats/create", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
export const StatsUpdate = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/stats/update", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const StatsAutoSearch = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/stats/search", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const OrderList = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/order/list", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
export const OrderCreate = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/order/create", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
export const OrderUpdate = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/order/update", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
