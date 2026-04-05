import express from "express";
import Customer from "../models/Customer.js";
import MenuCategory from "../models/MenuCategory.js";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import SiteSetting from "../models/SiteSetting.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { toPublicCustomer } from "../utils/customer.js";

const router = express.Router();

router.use(requireAdmin);

router.get("/bootstrap", async (_req, res) => {
  const [orders, users, reviews, settings, categories, items] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).lean(),
    Customer.find().sort({ createdAt: -1 }).lean(),
    Review.find().sort({ createdAt: -1 }).lean(),
    SiteSetting.findOne({ key: "default" }).lean(),
    MenuCategory.find().sort({ sortOrder: 1, name: 1 }).lean(),
    MenuItem.find().sort({ sortOrder: 1, name: 1 }).lean(),
  ]);

  const dashboard = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    totalUsers: users.length,
    blockedUsers: users.filter((user) => user.isBlocked).length,
    totalReviews: reviews.length,
    totalMenus: categories.length,
    totalItems: items.length,
  };

  res.json({
    dashboard,
    orders,
    users: users.map(toPublicCustomer),
    reviews,
    settings,
    categories,
    items,
  });
});

router.patch("/orders/:id", async (req, res) => {
  const status = req.body?.status;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: status?.trim() || "pending" },
    { new: true },
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found.",
    });
  }

  res.json(order);
});

router.patch("/users/:id/block", async (req, res) => {
  const isBlocked = Boolean(req.body.isBlocked);

  const targetUser = await Customer.findById(req.params.id);

  if (!targetUser) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  // Prevent blocking an admin
  if (targetUser.role === "admin") {
    return res.status(403).json({
      message: "Admin accounts cannot be blocked.",
    });
  }

  targetUser.isBlocked = isBlocked;
  targetUser.blockedAt = isBlocked ? new Date() : null;
  await targetUser.save();

  res.json(toPublicCustomer(targetUser));
});

router.delete("/users/:id", async (req, res) => {
  const targetUser = await Customer.findById(req.params.id);

  if (!targetUser) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  // Prevent deleting an admin
  if (targetUser.role === "admin") {
    return res.status(403).json({
      message: "Admin accounts cannot be deleted.",
    });
  }

  await targetUser.deleteOne();

  res.json({
    message: "User removed successfully.",
  });
});

router.delete("/reviews/:id", async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return res.status(404).json({
      message: "Review not found.",
    });
  }

  res.json({
    message: "Review removed successfully.",
  });
});

router.put("/settings", async (req, res) => {
  const payload = {
    key: "default",
    siteTitle: req.body.siteTitle?.trim() || "Tasty Town",
    siteSubtitle: req.body.siteSubtitle?.trim() || "",
    heroBadge: req.body.heroBadge?.trim() || "",
    logoKey: req.body.logoKey?.trim() || "",
    logoUrl: req.body.logoUrl?.trim() || "",
    contactLocation: req.body.contactLocation?.trim() || "",
    footerText: req.body.footerText?.trim() || "",
  };

  const settings = await SiteSetting.findOneAndUpdate(
    { key: "default" },
    payload,
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  res.json(settings);
});

router.post("/menu-categories", async (req, res) => {
  const category = await MenuCategory.create({
    name: req.body.name?.trim(),
    slug: req.body.slug?.trim().toLowerCase(),
    description: req.body.description?.trim() || "",
    imageKey: req.body.imageKey?.trim() || "",
    imageUrl: req.body.imageUrl?.trim() || "",
    sortOrder: Number(req.body.sortOrder ?? 0),
    isActive: req.body.isActive !== false,
  });

  res.status(201).json(category);
});

router.patch("/menu-categories/:id", async (req, res) => {
  const payload = {
    name: req.body.name?.trim(),
    slug: req.body.slug?.trim().toLowerCase(),
    description: req.body.description?.trim(),
    imageKey: req.body.imageKey?.trim(),
    imageUrl: req.body.imageUrl?.trim(),
    sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : undefined,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : undefined,
  };

  const category = await MenuCategory.findByIdAndUpdate(
    req.params.id,
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!category) {
    return res.status(404).json({
      message: "Menu category not found.",
    });
  }

  res.json(category);
});

router.delete("/menu-categories/:id", async (req, res) => {
  const category = await MenuCategory.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      message: "Menu category not found.",
    });
  }

  await MenuItem.deleteMany({ categorySlug: category.slug });
  await category.deleteOne();

  res.json({
    message: "Menu category removed successfully.",
  });
});

router.post("/menu-items", async (req, res) => {
  const item = await MenuItem.create({
    name: req.body.name?.trim(),
    description: req.body.description?.trim(),
    price: Number(req.body.price ?? 0),
    categorySlug: req.body.categorySlug?.trim().toLowerCase(),
    imageKey: req.body.imageKey?.trim() || "",
    imageUrl: req.body.imageUrl?.trim() || "",
    isFeatured: Boolean(req.body.isFeatured),
    isAvailable: req.body.isAvailable !== false,
    sortOrder: Number(req.body.sortOrder ?? 0),
  });

  res.status(201).json(item);
});

router.patch("/menu-items/:id", async (req, res) => {
  const payload = {
    name: req.body.name?.trim(),
    description: req.body.description?.trim(),
    price: req.body.price !== undefined ? Number(req.body.price) : undefined,
    categorySlug: req.body.categorySlug?.trim().toLowerCase(),
    imageKey: req.body.imageKey?.trim(),
    imageUrl: req.body.imageUrl?.trim(),
    isFeatured: req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : undefined,
    isAvailable: req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : undefined,
    sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : undefined,
  };

  const item = await MenuItem.findByIdAndUpdate(
    req.params.id,
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!item) {
    return res.status(404).json({
      message: "Menu item not found.",
    });
  }

  res.json(item);
});

router.delete("/menu-items/:id", async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({
      message: "Menu item not found.",
    });
  }

  res.json({
    message: "Menu item removed successfully.",
  });
});

export default router;
