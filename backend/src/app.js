import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import todosRoutes from './routes/todos.routes.js';
import { handleValidationErrors } from './utils/validation.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todosRoutes);
app.use('/uploads', express.static('uploads')); // 👈 Serve files from uploads dir
/*app.use('/uploads', express.static('uploads')); // 👈 Serve files from uploads dir
 import BlacklistedToken from './models/BlacklistedToken.js';

await BlacklistedToken.sync(); // creates table if not exists */

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
// Validation error handling middleware
// This middleware should be placed after all routes
// and before the error handling middleware
app.use(handleValidationErrors);

export default app;
