import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';  // Backend URL

export const getPosts = () => axios.get(`${API_BASE_URL}/posts`);
export const getPost = (id) => axios.get(`${API_BASE_URL}/posts/${id}`);
export const createPost = (data) => axios.post(`${API_BASE_URL}/posts/create`, data);
export const updatePost = (id, data) => axios.put(`${API_BASE_URL}/posts/${id}`, data);
export const deletePost = (id) => axios.delete(`${API_BASE_URL}/posts/${id}`);
