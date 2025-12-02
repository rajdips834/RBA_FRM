import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const clearLogs = () => apiClient.post("/api/clear-logs");

export default apiClient;
