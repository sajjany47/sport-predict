import axios from "axios";

export const StatsList = async () => {
  try {
    const response = await axios.get("/api/stats/list", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const StatsCreate = async (payload: any) => {
  try {
    const response = await axios.post("/api/stats/create", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const StatsUpdate = async (payload: any) => {
  try {
    const response = await axios.post("/api/stats/update", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const StatsAutoSearch = async (payload: any) => {
  try {
    const response = await axios.post("/api/stats/search", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
