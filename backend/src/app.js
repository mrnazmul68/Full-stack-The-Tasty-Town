import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import apiRoutes from './routes/index.js';

const app = express();
const defaultAllowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173'];
const allowedOrigins = [
  ...defaultAllowedOrigins,
  ...(process.env.FRONTEND_URLS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim()] : []),
];
const allowedOriginSet = new Set(allowedOrigins);
const isLocalOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOriginSet.has(origin) || isLocalOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
  })
);
app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
  res.json({
    message: 'TastyTown backend is running.',
  });
});

app.use('/api', apiRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || 'Internal server error.',
  });
});

export default app;
