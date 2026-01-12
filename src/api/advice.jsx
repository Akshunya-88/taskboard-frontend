import axios from './axiosInstance';
export const getAdvice = (data) => axios.post('/api/tasks/advice/', data);