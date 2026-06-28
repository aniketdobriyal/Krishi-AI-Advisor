import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 15000 // 15 seconds timeout
});

export default API;
