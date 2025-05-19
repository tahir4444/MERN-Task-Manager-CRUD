import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

// Configure ToastContainer defaults
const toastContainerProps = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'colored',
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer {...toastContainerProps} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
// This code sets up a React application with routing and authentication context.
