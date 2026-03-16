// api/publicApi.ts
import axios from "axios";

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// No interceptors, plain API
export default publicApi;
