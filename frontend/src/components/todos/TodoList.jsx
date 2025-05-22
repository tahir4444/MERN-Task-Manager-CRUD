import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-toastify';

const TodoList = ({ todos, onTodoUpdated, onTodoDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async (id, completed) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session expired. Please login again.');
        return;
      }

      const todo = todos.find(t => t._id === id);
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, {
        ...todo,
        completed: !completed
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onTodoUpdated(response.data);
      toast.success('Todo updated successfully');
    } catch (error) {
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
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session expired. Please login again.');
        return;
      }

      await axios.delete(`${API_BASE_URL}/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onTodoDeleted(id);
      toast.success('Todo deleted successfully');
    } catch (error) {
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
    return <div className="text-center py-4 text-muted">No todos found. Add one to get started!</div>;
  }

  return (
    <div className="list-group">
      {todos.map((todo) => (
        <div
          key={todo._id}
          className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center p-2 mb-2 rounded-2 border-0 ${
            todo.completed ? 'bg-light' : 'bg-white'
          }`}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo._id, todo.completed)}
                style={{ 
                  width: '1rem', 
                  height: '1rem',
                  cursor: 'pointer',
                  borderColor: todo.completed ? '#198754' : '#dee2e6'
                }}
              />
            </div>
            <div>
              <h6 className={`mb-0 fw-semibold ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                {todo.title}
              </h6>
              <span className={`badge rounded-pill px-2 py-0 ${todo.completed ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                {todo.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
          <div className="d-flex gap-1">
            <button
              className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-1 text-white ${
                todo.completed 
                  ? 'btn-danger' 
                  : 'btn-primary'
              }`}
              onClick={() => handleToggleComplete(todo._id, todo.completed)}
              disabled={loading}
              style={{ 
                minWidth: '150px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                border: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
              }}
            >
              <i className={`bi ${todo.completed ? 'bi-x-circle' : 'bi-check-circle'} fs-6`}></i>
              {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button
              className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2 px-3 py-1"
              onClick={() => handleDelete(todo._id)}
              disabled={loading}
              style={{ 
                minWidth: '90px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
              }}
            >
              <i className="bi bi-trash fs-6"></i>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;