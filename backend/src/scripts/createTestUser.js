import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Role from '../models/Role.js';

dotenv.config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the user role
    const userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      console.error('User role not found');
      process.exit(1);
    }

    // Create test user
    const testUser = new User({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      mobile: '1234567890',
      address: '123 Test St',
      role: userRole._id
    });

    await testUser.save();
    console.log('Test user created:', {
      id: testUser._id,
      name: testUser.name,
      email: testUser.email,
      role: userRole.name
    });

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

// Run the creation
createTestUser(); 