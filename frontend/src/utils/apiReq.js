import axios from "axios";

const apiReq = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default apiReq;