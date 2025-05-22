import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Todo from '../models/Todo.js';
import User from '../models/User.js';

dotenv.config();

const checkTodos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'todo-mongo-curdapp' });
    console.log('Connected to MongoDB');

    // Get all todos
    const todos = await Todo.find().populate('userId', 'name email');
    console.log('Existing todos:', todos);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error checking todos:', error);
    process.exit(1);
  }
};

checkTodos(); 