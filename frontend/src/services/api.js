import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-log-analyzer-p83w.onrender.com",
});

export const getLogs = async () => {
  const response = await API.get("/logs");
  return response.data;
};

export const getAnomalies = async () => {
  const response = await API.get("/logs/anomalies");
  return response.data;
};

export const analyzeLog = async (logId) => {
  const response = await API.post(`/logs/${logId}/analyze`);
  return response.data;
};

export const createLog = async (logData) => {
  const response = await API.post("/logs", logData);
  return response.data;
};

export default API;