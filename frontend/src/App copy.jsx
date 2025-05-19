import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route
          index
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />
        <Route
          path="login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />
        <Route
          path="register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
          }
        />

        {/* Protected routes */}
        <Route
          path="dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" state={{ from: '/dashboard' }} replace />
            )
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
