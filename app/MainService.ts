import axios from "axios";

export const SubscriptionCreate = async (payload: any) => {
  try {
    const response = await axios.post("/subscription/create", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const SubscriptionUpdate = async (payload: any) => {
  try {
    const response = await axios.post("/subscription/update", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const SubscriptionList = async () => {
  try {
    const response = await axios.get("/subscription/list", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
