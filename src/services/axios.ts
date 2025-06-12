import axios from "axios";

// Default to localhost if environment variable is not set
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
