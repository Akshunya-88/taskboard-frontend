import axios from './axiosInstance';
export const getAdvice = (data) => axios.post('/tasks/advice/', data);