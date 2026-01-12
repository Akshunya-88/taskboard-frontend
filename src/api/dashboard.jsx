import axios from "./axiosInstance";

export const getDashboard = () => axios.get("/api/tasks/dashboard/");