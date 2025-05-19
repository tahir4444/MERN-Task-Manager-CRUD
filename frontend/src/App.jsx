import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import { Suspense } from 'react';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-light dark:bg-primary-dark rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <MuiThemeProvider theme={createTheme()}>
        <CssBaseline />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
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
                  isAuthenticated ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <RegisterPage />
                  )
                }
              />

              {/* Protected routes - wrapped in Suspense for lazy loading */}
              <Route
                path="dashboard"
                element={
                  isAuthenticated ? (
                    <Suspense
                      fallback={
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
                        </div>
                      }
                    >
                      <Dashboard />
                    </Suspense>
                  ) : (
                    <Navigate
                      to="/login"
                      state={{ from: '/dashboard' }}
                      replace
                    />
                  )
                }
              />

              {/* Catch-all route */}
              <Route
                path="*"
                element={
                  <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
                }
              />
            </Route>
          </Routes>
        </div>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

export default App;
