import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

const connectionStateLabels = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export const getMongoConnectionState = () =>
  connectionStateLabels[mongoose.connection.readyState] ?? 'unknown';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'tastytown';
  const connectTimeoutMs = Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 7000);
  let timeoutHandle;

  if (!mongoUri) {
    const errorMsg = 'MONGODB_URI is missing. Database connection is required.';
    console.error(errorMsg);
    return {
      connected: false,
      dbName,
      error: errorMsg,
    };
  }

  try {
    await Promise.race([
      mongoose.connect(mongoUri, {
        dbName,
        serverSelectionTimeoutMS: 5000,
      }),
      new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(
            new Error(`MongoDB connection timed out after ${connectTimeoutMs}ms`)
          );
        }, connectTimeoutMs);
      }),
    ]);

    clearTimeout(timeoutHandle);

    console.log(`MongoDB connected to "${dbName}"`);

    return {
      connected: true,
      dbName,
    };
  } catch (error) {
    clearTimeout(timeoutHandle);
    if (mongoose.connection.readyState !== 0) {
      void mongoose.disconnect().catch(() => {});
    }

    const errorMsg = `MongoDB connection failed: ${error.message}`;
    console.error(errorMsg);

    return {
      connected: false,
      dbName,
      error: errorMsg,
    };
  }
};
