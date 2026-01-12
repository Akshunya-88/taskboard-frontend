import axios from './axiosInstance';

export const getCategories = () => axios.get('/api/tasks/categories/');
export const createCategory = (data) => axios.post('/api/tasks/categories/', data);
export const updateCategory = (id, data) => axios.put(`/api/tasks/categories/${id}/`, data);
export const deleteCategory = (id) => axios.delete(`/api/tasks/categories/${id}/`);