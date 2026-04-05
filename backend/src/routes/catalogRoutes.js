import express from "express";
import MenuCategory from "../models/MenuCategory.js";
import MenuItem from "../models/MenuItem.js";
import Review from "../models/Review.js";
import SiteSetting from "../models/SiteSetting.js";

const router = express.Router();

router.get("/bootstrap", async (_req, res) => {
  const [categories, items, reviews, settings] = await Promise.all([
    MenuCategory.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean(),
    MenuItem.find({ isAvailable: true }).sort({ sortOrder: 1, name: 1 }).lean(),
    Review.find().sort({ createdAt: -1 }).limit(12).lean(),
    SiteSetting.findOne({ key: "default" }).lean(),
  ]);

  res.json({
    categories,
    items,
    reviews,
    settings,
  });
});

export default router;
