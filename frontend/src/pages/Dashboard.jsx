import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  console.log('Dashboard rendered');

  console.log('Dashboard rendered, user:', user);

  // Fetch todos when component mounts
  useEffect(() => {
    console.log('useEffect triggered, user:', user);
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }
    console.log('User found, fetching todos');
    fetchTodos();
  }, [user, navigate]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      console.log('Fetching todos...');
      const response = await axios.get(`${API_BASE_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      console.log('Fetched todos:', response.data);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching todos:', err);
      if (err.response?.status === 401) {
        console.log('Unauthorized, redirecting to login');
        navigate('/login');
      } else {
        setError('Failed to fetch todos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTodoAdded = async (newTodo) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/todos`, newTodo, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      console.log('Added new todo:', response.data);
      setTodos(prevTodos => [...prevTodos, response.data]);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to add todo');
      }
    }
  };

  const handleTodoUpdated = (updatedTodo) => {
    console.log('Updating todo in state:', updatedTodo);
    setTodos(prevTodos => prevTodos.map(todo => 
      todo._id === updatedTodo._id ? updatedTodo : todo
    ));
  };

  const handleTodoDeleted = (todoId) => {
    console.log('Removing todo from state:', todoId);
    setTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoId));
  };

  // Calculate stats
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  console.log('Current stats:', { totalTasks, completedTasks, pendingTasks });

  if (!user) {
    console.log('No user found, redirecting to login');
    navigate('/login');
    return;
  }

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
          My Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Active
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Add Todo Card */}
      <div
        className={`p-6 rounded-lg shadow-md mb-8 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Create New Todo
          </h2>
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-300 font-bold">
              +
            </span>
          </div>
        </div>
        <TodoForm onTodoAdded={handleTodoAdded} />
      </div>

      {/* Todo List Section */}
      <div
        className={`p-6 rounded-lg shadow-md transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Your Tasks
          </h2>
          <span className="px-3 py-1 text-sm rounded-full bg-blue-600 text-white">
            {pendingTasks} Pending
          </span>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading todos...</div>
          ) : (
            <TodoList 
              todos={todos}
              onTodoUpdated={handleTodoUpdated}
              onTodoDeleted={handleTodoDeleted}
            />
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div
          className={`p-4 rounded-lg shadow-md transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Tasks
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {totalTasks}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg shadow-md transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Completed
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            {completedTasks}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg shadow-md transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Pending
          </h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
            {pendingTasks}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
