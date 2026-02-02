// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://apiusuariospj.onrender.com/",
});

api.interceptors.response.use(
  response => response,
  async error => {
    ...
  }
);

export default api;
