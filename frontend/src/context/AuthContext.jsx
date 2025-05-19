import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin, register as authRegister, getMe } from '../services/auth.service.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getMe(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { user, token } = await authLogin(email, password);
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { user, token } = await authRegister(name, email, password);
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);