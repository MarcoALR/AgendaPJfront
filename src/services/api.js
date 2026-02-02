import axios from "axios";

// Esta linha limpa qualquer barra que venha do Vercel ou do código
const API_URL = (
  import.meta.env.VITE_API_URL || "https://apiusuariospj.onrender.com"
).replace(/\/$/, ""); 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;