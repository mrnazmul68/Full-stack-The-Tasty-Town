import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 }).limit(12).lean();
  res.json(reviews);
});

router.post("/", async (req, res) => {
  const { name, email, message, rating } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      message: "Name, email, and review message are required.",
    });
  }

  const review = await Review.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
    rating: Number(rating || 5),
  });

  return res.status(201).json({
    message: "Thanks for your review. It has been added successfully.",
    review,
  });
});

export default router;
