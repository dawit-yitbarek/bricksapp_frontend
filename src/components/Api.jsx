import axios from "axios";

const api = axios.create({
  baseURL: "https://bricksapp-backend.onrender.com",
  withCredentials: true,
});

export default api;