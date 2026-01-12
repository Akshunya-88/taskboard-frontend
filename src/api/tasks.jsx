import axios from './axiosInstance';

export const getTasks = (params) => axios.get('/tasks/', { params });
export const createTask = (data) => axios.post('/tasks/', data);
export const updateTask = (id, data) => axios.put(`/tasks/${id}/`, data);
export const deleteTask = (id) => axios.delete(`/tasks/${id}/`);