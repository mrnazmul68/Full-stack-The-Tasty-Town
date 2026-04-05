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
    console.log(`Login attempt for: ${normalizedEmail}`);

    // Check for Admin login first (hardcoded from env)
    const adminCreds = getAdminCredentials();
    if (normalizedEmail === adminCreds.email && password === adminCreds.password) {
      console.log("Admin login successful via hardcoded credentials");
      const token = createAdminToken({
        email: adminCreds.email,
        fullName: adminCreds.fullName,
      });

      return res.json({
        token,
        user: {
          id: "admin",
          email: adminCreds.email,
          fullName: adminCreds.fullName,
          role: "admin",
        },
      });
    }

    console.log("Searching for customer in database...");
    const customer = await Customer.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!customer) {
      console.log(`Customer not found: ${normalizedEmail}`);
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    console.log("Comparing password...");
    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      console.log(`Password mismatch for: ${normalizedEmail}`);
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (customer.isBlocked) {
      console.log(`Customer is blocked: ${normalizedEmail}`);
      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
      });
    }

    console.log("Generating JWT token...");
    const token = jwt.sign(
      { id: customer._id, email: customer.email, role: customer.role },
      process.env.JWT_SECRET || "tastytown-secret-key-fallback-123",
      { expiresIn: "7d" },
    );

    console.log(`Login successful for: ${normalizedEmail}`);
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
    console.error("Login error full details:", error);
    res.status(500).json({
      message: `Login failed: ${error.message}`,
      error: error.message,
      stack: error.stack,
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
    console.log(`Registration attempt for: ${normalizedEmail}`);

    console.log("Checking if email already exists...");
    const existingCustomer = await Customer.findOne({
      email: normalizedEmail,
    });

    if (existingCustomer) {
      console.log(`Email already registered: ${normalizedEmail}`);
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    console.log("Creating new customer...");
    const customer = await Customer.create({
      fullName: fullName?.trim(),
      email: normalizedEmail,
      password,
    });

    console.log("Generating JWT token...");
    const token = jwt.sign(
      { id: customer._id, email: customer.email, role: customer.role },
      process.env.JWT_SECRET || "tastytown-secret-key-fallback-123",
      { expiresIn: "7d" },
    );

    console.log(`Registration successful for: ${normalizedEmail}`);
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
    console.error("Registration error full details:", error);
    res.status(500).json({
      message: `Registration failed: ${error.message}`,
      error: error.message,
      stack: error.stack,
    });
  }
});

export default router;
