import express from 'express';
import mongoose from 'mongoose';
import { getMongoConnectionState } from '../config/db.js';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import catalogRoutes from './catalogRoutes.js';
import customerRoutes from './customerRoutes.js';
import orderRoutes from './orderRoutes.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: {
      state: getMongoConnectionState(),
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || process.env.MONGODB_DB || null,
    },
  });
});

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/catalog', catalogRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);

export default router;
