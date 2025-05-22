import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../models/Role.js';

dotenv.config();

const checkRoles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all roles
    const roles = await Role.find({});
    console.log('Existing roles:', JSON.stringify(roles, null, 2));

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error checking roles:', error);
    process.exit(1);
  }
};

// Run the check
checkRoles(); 