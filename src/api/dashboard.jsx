import axios from "./axiosInstance";

export const getDashboard = () => axios.get("/tasks/dashboard/");