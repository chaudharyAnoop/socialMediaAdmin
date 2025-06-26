import axios from "axios";
import token from "../redux/tokens";

const api = axios.create({
  baseURL: "http://172.50.3.106:3002",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  //   const token = localStorage.getItem("admin_token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
