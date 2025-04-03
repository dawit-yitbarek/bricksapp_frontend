import axios from "axios";

const api = axios.create({
  baseURL: "https://bricks-1i79.onrender.com",
  withCredentials: true,
});

export default api;