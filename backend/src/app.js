import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import todosRoutes from './routes/todos.routes.js';
import roleRoutes from './routes/role.routes.js';
import userRoutes from './routes/user.routes.js';
import { handleValidationErrors } from './utils/validation.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todosRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/accounts', userRoutes);

// Serve static files
app.use('/uploads', express.static('uploads'));

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
