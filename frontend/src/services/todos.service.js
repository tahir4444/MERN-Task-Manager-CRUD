import axios from 'axios';
import { getToken } from '../utils/auth.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getTodos = async () => {
  const response = await axios.get(`${API_BASE_URL}/todos`, getAuthHeader());
  return response.data;
};

export const createTodo = async (todoData) => {
  const response = await axios.post(
    `${API_BASE_URL}/todos`,
    todoData,
    getAuthHeader()
  );
  return response.data;
};

export const updateTodo = async (id, todoData) => {
  const response = await axios.put(
    `${API_BASE_URL}/todos/${id}`,
    todoData,
    getAuthHeader()
  );
  return response.data;
};

export const deleteTodo = async (id) => {
  await axios.delete(`${API_BASE_URL}/todos/${id}`, getAuthHeader());
};