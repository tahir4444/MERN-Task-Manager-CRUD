import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import Navbar from '../components/layout/Navbar';
import { getTodos, updateTodo, deleteTodo } from '../services/todos.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTodos();
    // Force light theme
    if (theme === 'dark') {
      toggleTheme();
    }
  }, [user, navigate, theme, toggleTheme]);

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await getTodos();
      setTodos(fetchedTodos);
      
      // Calculate stats
      const total = fetchedTodos.length;
      const completed = fetchedTodos.filter(todo => todo.completed).length;
      const pending = total - completed;
      
      setStats({ total, completed, pending });
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to fetch todos');
    }
  };

  const handleStatusChange = async (todoId, currentStatus) => {
    try {
      await updateTodo(todoId, { completed: !currentStatus });
      fetchTodos(); // Refresh the list
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async (todoId) => {
    try {
      await deleteTodo(todoId);
      fetchTodos(); // Refresh the list
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      await updateTodo(editingTodo._id, {
        ...editingTodo,
        title: editTitle.trim()
      });
      setEditingTodo(null);
      setEditTitle('');
      toast.success('Task updated successfully');
      fetchTodos(); // Refresh stats
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="min-vh-100 bg-light text-dark">
      <Navbar />
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col">
            <h1>Welcome, {user?.name || 'User'}!</h1>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-md-4 mb-4">
            <div className="card bg-light text-dark border-dark h-100">
              <div className="card-body">
                <h5 className="card-title">Total Tasks</h5>
                <p className="card-text display-4">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card bg-light text-dark border-dark h-100">
              <div className="card-body">
                <h5 className="card-title">Completed Tasks</h5>
                <p className="card-text display-4">{stats.completed}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card bg-light text-dark border-dark h-100">
              <div className="card-body">
                <h5 className="card-title">Pending Tasks</h5>
                <p className="card-text display-4">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="card bg-light text-dark border-dark">
              <div className="card-header">
                <h5 className="mb-0">Task List</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todos.map((todo) => (
                        <tr key={todo._id}>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleStatusChange(todo._id, todo.completed)}
                                id={`todo-${todo._id}`}
                              />
                              <label
                                className={`form-check-label ${
                                  todo.completed ? 'text-decoration-line-through text-muted' : ''
                                }`}
                                htmlFor={`todo-${todo._id}`}
                              >
                                {todo.title}
                              </label>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${todo.completed ? 'bg-success' : 'bg-warning'}`} style={{ minWidth: '80px', textAlign: 'center' }}>
                              {todo.completed ? 'Completed' : 'Pending'}
                            </span>
                          </td>
                          <td>{new Date(todo.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                style={{ minWidth: '140px' }}
                                onClick={() => handleStatusChange(todo._id, todo.completed)}
                              >
                                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                              </button>
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleEdit(todo)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(todo._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Todo Modal */}
      {editingTodo && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setEditingTodo(null);
                    setEditTitle('');
                  }}
                ></button>
              </div>
              <form onSubmit={handleUpdateTodo}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="editTitle" className="form-label">Task Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editTitle"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingTodo(null);
                      setEditTitle('');
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {editingTodo && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default DashboardPage; 