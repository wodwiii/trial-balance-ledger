"use server"
import mongoose from 'mongoose';
let cachedConnection: typeof mongoose | null = null;
export const connectToDatabase = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
  const connection = await mongoose.connect(process.env.MONGODB_URI);
  cachedConnection = connection;
  return connection;
};
