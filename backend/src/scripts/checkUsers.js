import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'todo-mongo-curdapp';

const checkUsers = async () => {
  try {
    // Log the masked connection string
    const maskedUri = process.env.MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://****:****@'
    );
    console.log('Connecting to MongoDB:', maskedUri);
    console.log('Current DB:', DB_NAME);

    // Connect to MongoDB with explicit DB_NAME
    await mongoose.connect(process.env.MONGODB_URI, { dbName: DB_NAME });
    console.log('Connected to MongoDB');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Find all users with their roles
    const users = await User.find({}).populate('role');
    console.log('Existing users:', JSON.stringify(users, null, 2));

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
};

// Run the check
checkUsers(); 