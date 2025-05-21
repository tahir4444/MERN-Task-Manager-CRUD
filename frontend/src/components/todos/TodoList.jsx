import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-toastify';

const TodoList = ({ todos, onTodoUpdated, onTodoDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async (id, completed) => {
    try {
      setLoading(true);
      console.log('Toggling todo with token:', axios.defaults.headers.common['Authorization']);
      const todo = todos.find(t => t._id === id);
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, {
        ...todo,
        completed: !completed
      });
      console.log('Toggle response:', response.data);
      onTodoUpdated(response.data);
      toast.success('Todo updated successfully');
    } catch (error) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to update todo';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      console.log('Deleting todo with token:', axios.defaults.headers.common['Authorization']);
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      console.log('Delete successful for todo:', id);
      onTodoDeleted(id);
      toast.success('Todo deleted successfully');
    } catch (error) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to delete todo';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (todos.length === 0) {
    return <div className="text-center py-4">No todos found. Add one to get started!</div>;
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo._id}
          className={`p-4 border rounded-lg ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`text-lg font-medium ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p className="mt-1 text-sm text-gray-600">{todo.description}</p>
              )}
            </div>
            <div className="ml-4 flex-shrink-0 flex space-x-2">
              <button
                onClick={() => handleToggleComplete(todo._id, todo.completed)}
                disabled={loading}
                className={`px-2 py-1 text-xs rounded ${
                  todo.completed
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                disabled={loading}
                className={`px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;