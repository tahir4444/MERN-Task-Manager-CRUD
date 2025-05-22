import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Todo from '../models/Todo.js';
import User from '../models/User.js';

dotenv.config();

const createTestTodo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'todo-mongo-curdapp' });
    console.log('Connected to MongoDB');

    // Find the test user
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      console.error('Test user not found');
      process.exit(1);
    }

    // Create test todo
    const todo = await Todo.create({
      title: 'Test Todo',
      description: 'This is a test todo item',
      userId: user._id
    });

    console.log('Test todo created:', todo);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating test todo:', error);
    process.exit(1);
  }
};

createTestTodo(); 