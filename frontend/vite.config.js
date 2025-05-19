import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default Vite port
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
  },
});
// This Vite configuration file sets up a React application with a development server
