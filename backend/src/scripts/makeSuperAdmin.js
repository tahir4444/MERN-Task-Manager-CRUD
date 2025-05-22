import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Role from '../models/Role.js';
import User from '../models/User.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: join(__dirname, '../../.env') });

const makeSuperAdmin = async () => {
  try {
    console.log('Starting script...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is not set');
    
    // Connect to MongoDB using existing connection string
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create superadmin role if it doesn't exist
    let superAdminRole = await Role.findOne({ name: 'superadmin' });
    if (!superAdminRole) {
      console.log('Creating superadmin role...');
      superAdminRole = await Role.create({
        name: 'superadmin',
        description: 'Super Administrator with full system access',
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
      });
      console.log('Superadmin role created');
    } else {
      console.log('Superadmin role already exists');
    }

    // Get the user's email from command line arguments
    const userEmail = process.argv[2];
    if (!userEmail) {
      console.error('Please provide a user email as an argument');
      process.exit(1);
    }
    console.log('Looking for user with email:', userEmail);

    // Find the user and update their role
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.error('User not found with email:', userEmail);
      process.exit(1);
    }
    console.log('Found user:', user.email);

    // Update user's role to superadmin
    user.role = superAdminRole._id;
    await user.save();
    console.log(`User ${userEmail} has been assigned the superadmin role`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    process.exit(1);
  }
};

// Run the script
makeSuperAdmin(); 