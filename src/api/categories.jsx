import axios from './axiosInstance';

export const getCategories = () => axios.get('/tasks/categories/');
export const createCategory = (data) => axios.post('/tasks/categories/', data);
export const updateCategory = (id, data) => axios.put(`/tasks/categories/${id}/`, data);
export const deleteCategory = (id) => axios.delete(`/tasks/categories/${id}/`);