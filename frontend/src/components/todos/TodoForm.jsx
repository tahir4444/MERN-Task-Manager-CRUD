import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createTodo } from '../../services/todos.service.js';

const TodoForm = ({ onTodoAdded }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const newTodo = await createTodo(data);
      onTodoAdded(newTodo);
      reset();
      toast.success('Todo added successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add todo');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title*
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Todo
        </button>
      </div>
    </form>
  );
};

export default TodoForm;