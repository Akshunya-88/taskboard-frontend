import axios from './axiosInstance';

export const getTasks = (params) => axios.get('/api/tasks/', { params });
export const createTask = (data) => axios.post('/api/tasks/', data);
export const updateTask = (id, data) => axios.put(`/api/tasks/${id}/`, data);
export const deleteTask = (id) => axios.delete(`/api/tasks/${id}/`);