import mongoose from 'mongoose';
import { getEnv } from '../../config/env.config';

const connectDB = async () => {
  try {
    const env = await getEnv();
    if (env?.DB_CONNECTION_STRING) {
      await mongoose.connect(env?.DB_CONNECTION_STRING);
      console.log('@connectDB Database connection success.');
      return;
    }
    throw new Error('Missing connection string.');
  } catch (error) {
    console.error('@connectDB ', error);
    process.exit(1);
  }
};

export default connectDB;
