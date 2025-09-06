import privateApi from "@/lib/privateAxiosClient";
import publicApi from "@/lib/publicAxiosClient";
import { getHeaders, getHeadersWithToken } from "@/lib/utils";

export const SubscriptionCreate = async (payload: any) => {
  try {
    const response = await privateApi.post(
      "/api/subscription/create",
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
export const SubscriptionUpdate = async (payload: any) => {
  try {
    const response = await privateApi.post(
      "/api/subscription/update",
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

export const SubscriptionList = async () => {
  try {
    const response = await publicApi.get("/api/subscription/list", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserLogin = async (payload: any) => {
  try {
    const response = await publicApi.post("/api/users/sigin", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserRegister = async (payload: any) => {
  try {
    const response = await publicApi.post("/api/users/signup", payload, {
      headers: getHeaders(),
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

export const UserResetPassword = async (payload: any) => {
  try {
    const response = await privateApi.post(
      "/api/users/reset-password",
      payload,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserUpdate = async (payload: any) => {
  try {
    const response = await publicApi.post("/api/users/update", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const TicketCreate = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/support/create", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const TicketUpdate = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/support/update", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const TicketList = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/support/list", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const TicketDetails = async (id: any) => {
  try {
    const response = await privateApi.get(`/api/support/${id}`, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
