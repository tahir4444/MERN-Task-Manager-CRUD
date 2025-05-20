import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import Navbar from '../components/layout/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

const TodosPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch todos on component mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTodos();
  }, [user, navigate]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch todos');
        console.error('Error fetching todos:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      try {
        const response = await axios.post(`${API_URL}/todos`, {
          title: newTodo,
          description: ''
        });
        setTodos([...todos, response.data]);
        setNewTodo('');
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to add todo');
          console.error('Error adding todo:', err);
        }
      }
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        ...todo,
        completed: !todo.completed
      });
      setTodos(todos.map(todo =>
        todo._id === id ? response.data : todo
      ));
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to update todo');
        console.error('Error updating todo:', err);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to delete todo');
        console.error('Error deleting todo:', err);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h1 className="card-title mb-4">My Tasks</h1>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {/* Add Todo Form */}
                <form onSubmit={handleAddTodo} className="mb-4">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a new task..."
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">
                      Add Task
                    </button>
                  </div>
                </form>

                {/* Todo List */}
                <div className="list-group">
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : todos.length === 0 ? (
                    <p className="text-center text-muted">No tasks yet. Add one above!</p>
                  ) : (
                    todos.map(todo => (
                      <div
                        key={todo._id}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      >
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo._id)}
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
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteTodo(todo._id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodosPage; 