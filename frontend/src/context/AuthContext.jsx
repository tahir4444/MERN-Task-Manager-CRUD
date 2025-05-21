import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Registration successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const hasRole = (roleName) => {
    return user?.roles?.includes(roleName);
  };

  const hasAnyRole = (roleNames) => {
    return user?.roles?.some(role => roleNames.includes(role));
  };

  const hasAllRoles = (roleNames) => {
    return user?.roles?.every(role => roleNames.includes(role));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole,
        hasAllRoles
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user, isAuthenticated, hasAnyRole } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    navigate('/unauthorized');
    return null;
  }

  return children;
};

export { AuthProvider, useAuth, ProtectedRoute };