import express from 'express';
import mongoose from 'mongoose';
import Customer from '../models/Customer.js';
import { toPublicCustomer } from '../utils/customer.js';

const router = express.Router();
const normalizeEmail = (email) => email.trim().toLowerCase();
const normalizeCustomerPayload = ({
  fullName,
  email,
  phone,
  address,
  photo,
  memberSince,
}) => ({
  fullName: fullName.trim(),
  email: normalizeEmail(email),
  phone: phone?.trim() || '',
  address: address?.trim() || '',
  photo: photo || '',
  memberSince: memberSince || '',
});

router.post('/', async (req, res) => {
  const { id, fullName, email, phone, address, photo, memberSince } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({
      message: 'fullName and email are required.',
    });
  }

  const customerPayload = normalizeCustomerPayload({
    fullName,
    email,
    phone,
    address,
    photo,
    memberSince,
  });

  const currentCustomer =
    id && mongoose.isValidObjectId(id) ? await Customer.findById(id) : null;
  const emailMatch = await Customer.findOne({ email: customerPayload.email });

  if (emailMatch && emailMatch._id.toString() !== currentCustomer?._id?.toString()) {
    return res.status(409).json({
      message: 'Another account is already using this email address.',
    });
  }

  const customer = currentCustomer || emailMatch;

  if (customer) {
    customer.fullName = customerPayload.fullName;
    customer.email = customerPayload.email;
    customer.phone = customerPayload.phone;
    customer.address = customerPayload.address;
    customer.photo = customerPayload.photo;
    customer.memberSince = customerPayload.memberSince || customer.memberSince || '';

    await customer.save();

    return res.json(toPublicCustomer(customer));
  }

  const createdCustomer = await Customer.create({
    ...customerPayload,
    memberSince: customerPayload.memberSince || String(new Date().getFullYear()),
  });

  return res.status(201).json(toPublicCustomer(createdCustomer));
});

export default router;
