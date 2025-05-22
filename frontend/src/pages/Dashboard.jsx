import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import TodoList from '../components/todos/TodoList';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    fetchTodos();
  }, [isAuthenticated, user, authLoading, navigate]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching todos:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch todos');
        toast.error('Failed to fetch todos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTodoUpdated = (updatedTodo) => {
    setTodos(prevTodos => prevTodos.map(todo => 
      todo._id === updatedTodo._id ? updatedTodo : todo
    ));
  };

  const handleTodoDeleted = (todoId) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoId));
  };

  // Calculate stats
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  if (authLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h1 className="h2 mb-3 mb-md-0">My Dashboard</h1>
        <span className="badge bg-primary">Active</span>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}
 
      {/* Stats Section */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title h6 text-muted">Total Tasks</h3>
              <p className="card-text display-6 text-primary">{totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title h6 text-muted">Completed</h3>
              <p className="card-text display-6 text-success">{completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title h6 text-muted">Pending</h3>
              <p className="card-text display-6 text-warning">{pendingTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Todo List Section */}
      <div className="card">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="h5 mb-0">Your Tasks</h2>
            <span className="badge bg-primary">{pendingTasks} Pending</span>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <TodoList 
              todos={todos}
              onTodoUpdated={handleTodoUpdated}
              onTodoDeleted={handleTodoDeleted}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
