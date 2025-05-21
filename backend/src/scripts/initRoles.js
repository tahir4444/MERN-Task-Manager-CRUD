import mongoose from 'mongoose';
import Role from '../models/Role.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultRoles = [
  {
    name: 'admin',
    description: 'Administrator with full access',
    permissions: [
      {
        resource: 'users',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        resource: 'todos',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        resource: 'roles',
        actions: ['create', 'read', 'update', 'delete']
      }
    ]
  },
  {
    name: 'manager',
    description: 'Manager with limited administrative access',
    permissions: [
      {
        resource: 'users',
        actions: ['read']
      },
      {
        resource: 'todos',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        resource: 'roles',
        actions: ['read']
      }
    ]
  },
  {
    name: 'user',
    description: 'Regular user with basic access',
    permissions: [
      {
        resource: 'todos',
        actions: ['create', 'read', 'update', 'delete']
      }
    ]
  }
];

const initializeRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing roles
    await Role.deleteMany({});
    console.log('Cleared existing roles');

    // Create new roles
    const roles = await Role.insertMany(defaultRoles);
    console.log('Created default roles:', roles.map(role => role.name));

    process.exit(0);
  } catch (error) {
    console.error('Error initializing roles:', error);
    process.exit(1);
  }
};

initializeRoles(); 