import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

router.get('/customer/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const orders = await Order.find({
      customerEmail: email.trim().toLowerCase(),
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const {
    customerName,
    customerEmail,
    phone,
    items = [],
    totalAmount,
    paymentMethod,
    paymentLabel,
    mobileAgent,
    transactionId,
    deliveryAddress,
    landmark,
    deliveryNote,
    status,
  } = req.body;

  if (!customerName || !customerEmail || items.length === 0) {
    return res.status(400).json({
      message: 'customerName, customerEmail, and at least one item are required.',
    });
  }

  const order = await Order.create({
    orderNumber: `TT-${Date.now().toString().slice(-8)}`,
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim().toLowerCase(),
    phone: phone?.trim() || '',
    items: items.map((item) => ({
      itemId: String(item.itemId ?? item._id ?? ''),
      name: item.name,
      image: item.image || item.imageUrl || '',
      quantity: Number(item.quantity),
      price: Number(item.price),
    })),
    totalAmount: Number(totalAmount ?? 0),
    paymentMethod: paymentMethod?.trim() || 'cash-on-delivery',
    paymentLabel: paymentLabel?.trim() || 'Cash on Delivery',
    mobileAgent: mobileAgent?.trim() || '',
    transactionId: transactionId?.trim() || '',
    deliveryAddress: deliveryAddress?.trim() || '',
    landmark: landmark?.trim() || '',
    deliveryNote: deliveryNote?.trim() || '',
    status: status?.trim() || 'pending',
  });

  res.status(201).json(order);
});

export default router;
