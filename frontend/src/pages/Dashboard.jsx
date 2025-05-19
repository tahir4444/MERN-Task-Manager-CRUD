import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);

  const handleTodoAdded = (newTodo) => {
    // This function will be called when a new todo is added
    console.log('New todo added:', newTodo);
  };

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
            {/* This would be dynamic in a real app */}
            {5} Pending
          </span>
        </div>

        <div className="space-y-4">
          <TodoList />
        </div>
      </div>

      {/* Stats Section (Optional) */}
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
            12
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
            7
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
            5
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
