import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/todos.service';
import TodoList from '../components/todos/TodoList';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

const TodosPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
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
      const fetchedTodos = await getTodos();
      setTodos(fetchedTodos);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await createTodo({
        title: newTodo.trim(),
        completed: false
      });
      setTodos([...todos, response]);
      setNewTodo('');
      setError(null);
      toast.success('Task added successfully');
    } catch (err) {
      setError('Failed to add todo');
      console.error('Error adding todo:', err);
      toast.error('Failed to add task');
    }
  };

  const handleTodoUpdated = (updatedTodo) => {
    setTodos(todos.map(todo =>
      todo._id === updatedTodo._id ? updatedTodo : todo
    ));
  };

  const handleTodoDeleted = (todoId) => {
    setTodos(todos.filter(todo => todo._id !== todoId));
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      const response = await updateTodo(editingTodo._id, {
        ...editingTodo,
        title: editTitle.trim()
      });
      setTodos(todos.map(todo =>
        todo._id === editingTodo._id ? response : todo
      ));
      setEditingTodo(null);
      setEditTitle('');
      toast.success('Task updated successfully');
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
      toast.error('Failed to update task');
    }
  };

  const toggleTodo = async (todoId) => {
    try {
      const response = await updateTodo(todoId, {
        completed: !todos.find(todo => todo._id === todoId).completed
      });
      setTodos(todos.map(todo =>
        todo._id === todoId ? response : todo
      ));
      toast.success('Task status updated successfully');
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
      toast.error('Failed to update task');
    }
  };

  if (!user) {
    return null;
  }

  return (
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
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!newTodo.trim()}
                  >
                    Add Task
                  </button>
                </div>
              </form>

              {/* Todo List */}
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
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
                            onChange={() => toggleTodo(todo._id)}
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
                          onClick={() => toggleTodo(todo._id)}
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
                          onClick={() => handleEdit(todo)}
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
                          <i className="bi bi-pencil fs-6"></i>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2 px-3 py-1"
                          onClick={() => handleTodoDeleted(todo._id)}
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
              )}
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

export default TodosPage; 