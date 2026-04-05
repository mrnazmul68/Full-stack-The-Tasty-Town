import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { hashSync, compareSync } = bcrypt;

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      default: "customer",
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    photo: {
      type: String,
      default: '',
    },
    memberSince: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    this.password = hashSync(this.password, 12);
  } catch (err) {
    throw err;
  }
});

customerSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    if (!this.password) return false;
    return compareSync(candidatePassword, this.password);
  } catch (err) {
    console.error("comparePassword error:", err);
    return false;
  }
};

export default mongoose.model('Customer', customerSchema);
