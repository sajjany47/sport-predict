import axios from "axios";
import publicApi from "./publicAxiosClient";

const privateApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

privateApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

privateApi.interceptors.response.use(
  (response) => {
    // Try header first
    const newAccessToken =
      response.headers["x-access-token"] || response.headers["authorization"];

    // Or from body (refresh-token-api)
    if (response.data?.accessToken) {
      sessionStorage.setItem("token", response.data.accessToken);
    } else if (newAccessToken) {
      const token = newAccessToken.startsWith("Bearer ")
        ? newAccessToken.split(" ")[1]
        : newAccessToken;
      sessionStorage.setItem("token", token);
    }

    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // call refresh endpoint
        const refreshRes = await publicApi.post("/api/refresh-token-api", {});
        const newToken = refreshRes.data.accessToken;

        if (newToken) {
          sessionStorage.setItem("token", newToken);

          // retry original request
          error.config.headers["Authorization"] = `Bearer ${newToken}`;
          return privateApi.request(error.config);
        }
      } catch (err) {
        sessionStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default privateApi;
