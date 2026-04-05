import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, 'At least one order item is required.'],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: 'cash-on-delivery',
    },
    paymentLabel: {
      type: String,
      trim: true,
      default: 'Cash on Delivery',
    },
    mobileAgent: {
      type: String,
      trim: true,
      default: "",
    },
    transactionId: {
      type: String,
      trim: true,
      default: "",
    },
    deliveryAddress: {
      type: String,
      trim: true,
      default: '',
    },
    landmark: {
      type: String,
      trim: true,
      default: "",
    },
    deliveryNote: {
      type: String,
      trim: true,
      default: "",
    },
    orderNumber: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      trim: true,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Order', orderSchema);
