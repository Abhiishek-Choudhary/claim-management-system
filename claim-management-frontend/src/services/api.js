import axios from "axios";

const API = axios.create({
  baseURL: "https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;
