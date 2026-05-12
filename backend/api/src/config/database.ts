import mongoose from 'mongoose';
import { env } from './env';

const mongoConnectionOptions = {
  autoIndex: env.APP_ENV !== 'production',
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 20,
};

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection disconnected');
});

export const connectMongoDB = async (): Promise<typeof mongoose> => {
  if (!env.DB_MONGO_URI) {
    throw new Error('DB_MONGO_URI is required to start the backend API');
  }

  try {
    const connection = await mongoose.connect(env.DB_MONGO_URI, mongoConnectionOptions);

    console.log('MongoDB connected successfully');

    return connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};

export const disconnectMongoDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  console.log('MongoDB disconnected successfully');
};
