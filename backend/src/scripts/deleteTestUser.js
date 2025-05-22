import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const deleteTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await User.deleteOne({ email: 'test@example.com' });
    if (result.deletedCount > 0) {
      console.log('Test user deleted.');
    } else {
      console.log('Test user not found.');
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error deleting test user:', error);
    process.exit(1);
  }
};

deleteTestUser(); 