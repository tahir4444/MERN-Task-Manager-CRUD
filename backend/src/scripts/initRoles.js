import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../models/Role.js';

dotenv.config();

const defaultRoles = [
  {
    name: 'user',
    description: 'Regular user with basic permissions',
    permissions: [
      {
        resource: 'todos',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        resource: 'profile',
        actions: ['read', 'update']
      }
    ]
  },
  {
    name: 'admin',
    description: 'Administrator with full access',
    permissions: [
      {
        resource: 'todos',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        resource: 'users',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        resource: 'roles',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        resource: 'profile',
        actions: ['read', 'update']
      }
    ]
  }
];

const initializeRoles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing roles
    await Role.deleteMany({});
    console.log('Cleared existing roles');

    // Insert default roles
    const roles = await Role.insertMany(defaultRoles);
    console.log('Default roles created:', roles.map(role => role.name));

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error initializing roles:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeRoles(); 