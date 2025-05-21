import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'todo-mongo-curdapp';

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const connectDB = async () => {
  try {
    // Log the masked connection string
    const maskedUri = process.env.MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://****:****@'
    );
    console.log('Connecting to MongoDB:', maskedUri);
    console.log('Database Name:', DB_NAME);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;