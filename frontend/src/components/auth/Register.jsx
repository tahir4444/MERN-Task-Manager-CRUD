import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();
  const { register: registerUser, isAuthenticated } = useAuth();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Registration successful! Welcome to your dashboard.');
    } catch (error) {
      toast.error(
        error.response?.data?.error || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="text-center mb-8">
          <h2
            className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
          >
            Create Account
          </h2>
          <p
            className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Join us to start managing your todos
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className={`mt-1 block w-full px-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'
              } shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`mt-1 block w-full px-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'
              } shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className={`mt-1 block w-full px-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'
              } shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
            <p
              className={`mt-1 text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
              className={`mt-1 block w-full px-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'
              } shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
                isSubmitting
                  ? 'bg-blue-400'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } transition-colors duration-200`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>

        <div
          className={`mt-6 text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <p>
            Already have an account?{' '}
            <Link
              to="/login"
              className={`font-medium ${
                theme === 'dark'
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-500'
              } transition-colors`}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
// This code is a React component for a registration page. It uses react-hook-form for form handling and validation, and react-toastify for notifications. The component checks if the user is already authenticated and redirects them to the dashboard if they are. It also provides feedback on form submission status and handles errors gracefully.
