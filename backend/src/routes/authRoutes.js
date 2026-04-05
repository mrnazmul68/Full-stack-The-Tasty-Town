import express from "express";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import { getAdminCredentials, createAdminToken } from "../utils/adminAuth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for Admin login first
    const adminCreds = getAdminCredentials();
    if (normalizedEmail === adminCreds.email && password === adminCreds.password) {
      const adminToken = createAdminToken({
        email: adminCreds.email,
        fullName: adminCreds.fullName,
      });

      return res.json({
        adminToken,
        user: {
          id: "admin",
          email: adminCreds.email,
          fullName: adminCreds.fullName,
          role: "admin",
        },
      });
    }

    const customer = await Customer.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!customer) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (customer.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
      });
    }

    const token = jwt.sign(
      { id: customer._id, email: customer.email, role: customer.role },
      process.env.JWT_SECRET || "tastytown-secret-key-fallback-123",
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: customer._id,
        email: customer.email,
        fullName: customer.fullName,
        role: customer.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "An error occurred during login. Please try again later.",
      error: error.message,
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingCustomer = await Customer.findOne({
      email: normalizedEmail,
    });

    if (existingCustomer) {
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    const customer = await Customer.create({
      fullName: fullName?.trim(),
      email: normalizedEmail,
      password,
    });

    const token = jwt.sign(
      { id: customer._id, email: customer.email, role: customer.role },
      process.env.JWT_SECRET || "tastytown-secret-key-fallback-123",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      token,
      user: {
        id: customer._id,
        email: customer.email,
        fullName: customer.fullName,
        role: customer.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "An error occurred during registration. Please try again later.",
      error: error.message,
    });
  }
});

export default router;
