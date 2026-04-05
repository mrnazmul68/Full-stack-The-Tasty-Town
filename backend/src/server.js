import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { ensureDefaultAppData } from './utils/seedAppData.js';

const port = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    const { connected } = await connectDB();

    if (connected) {
      await ensureDefaultAppData();
    } else {
      console.error('Database connection failed. Database is required for this application.');
      process.exit(1);
    }

    app.listen(port, () => {
      console.log(
        `Backend server listening on http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error('Failed to start backend server');
    console.error(error.stack || error.message);
    process.exit(1);
  }
};

startServer();
