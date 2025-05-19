import { useState, useEffect } from 'react';
import { getTodos, updateTodo, deleteTodo } from '../../services/todos.service.js';
import { toast } from 'react-toastify';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (error) {
        toast.error('Failed to fetch todos');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleToggleComplete = async (id, completed) => {
    try {
      const updatedTodo = await updateTodo(id, { completed: !completed });
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
      toast.success('Todo updated successfully');
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading todos...</div>;
  }

  if (todos.length === 0) {
    return <div className="text-center py-4">No todos found. Add one to get started!</div>;
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
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
                onClick={() => handleToggleComplete(todo.id, todo.completed)}
                className={`px-2 py-1 text-xs rounded ${
                  todo.completed
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
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