import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      await registerUser(
        data.name,
        data.username,
        data.email,
        data.mobile,
        data.address,
        data.password,
        data.profile_pic
      );
      toast.success('Registration successful! Welcome to your dashboard.');
    } catch (error) {
      toast.error(
        error.response?.data?.error || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          {...register('name', { required: 'Name is required' })}
          placeholder="John Doe"
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          type="text"
          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          {...register('username', { 
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters'
            }
          })}
          placeholder="johndoe"
        />
        {errors.username && (
          <div className="invalid-feedback">{errors.username.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          placeholder="you@example.com"
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="mobile" className="form-label">
          Mobile Number
        </label>
        <input
          id="mobile"
          type="tel"
          className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
          {...register('mobile', {
            required: 'Mobile number is required',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Please enter a valid 10-digit mobile number'
            }
          })}
          placeholder="1234567890"
        />
        {errors.mobile && (
          <div className="invalid-feedback">{errors.mobile.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="address" className="form-label">
          Address
        </label>
        <textarea
          id="address"
          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
          {...register('address', { required: 'Address is required' })}
          placeholder="Enter your address"
          rows="3"
        />
        {errors.address && (
          <div className="invalid-feedback">{errors.address.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="profile_pic" className="form-label">
          Profile Picture
        </label>
        <input
          id="profile_pic"
          type="file"
          className={`form-control ${errors.profile_pic ? 'is-invalid' : ''}`}
          {...register('profile_pic')}
          accept="image/*"
        />
        {errors.profile_pic && (
          <div className="invalid-feedback">{errors.profile_pic.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          placeholder="••••••••"
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
        <div className="form-text">Must be at least 6 characters</div>
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === watch('password') || 'Passwords do not match',
          })}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <div className="invalid-feedback">{errors.confirmPassword.message}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-100 py-2"
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

export default Register;
// This code is a React component for a registration page. It uses react-hook-form for form handling and validation, and react-toastify for notifications. The component checks if the user is already authenticated and redirects them to the dashboard if they are. It also provides feedback on form submission status and handles errors gracefully.
