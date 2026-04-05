import MenuCategory from "../models/MenuCategory.js";
import MenuItem from "../models/MenuItem.js";
import Review from "../models/Review.js";
import SiteSetting from "../models/SiteSetting.js";
import Customer from "../models/Customer.js";
import { getAdminCredentials } from "./adminAuth.js";
import {
  defaultMenuCategories,
  defaultMenuItems,
  defaultSiteSettings,
} from "../data/defaultCatalog.js";

export const ensureDefaultAppData = async () => {
  const adminCreds = getAdminCredentials();
  const [categoryCount, itemCount, reviewCount, existingSettings, adminUserByEmail] = await Promise.all([
    MenuCategory.countDocuments(),
    MenuItem.countDocuments(),
    Review.countDocuments(),
    SiteSetting.findOne({ key: "default" }),
    Customer.findOne({ email: adminCreds.email }),
  ]);

  // Ensure Admin User exists and has correct role
  if (!adminUserByEmail) {
    try {
      await Customer.create({
        fullName: adminCreds.fullName,
        email: adminCreds.email,
        password: adminCreds.password,
        role: "admin",
        memberSince: String(new Date().getFullYear()),
      });
      console.log(`Admin user created: ${adminCreds.email}`);
    } catch (err) {
      console.error(`Failed to create admin user: ${err.message}`);
    }
  } else if (adminUserByEmail.role !== "admin") {
    // If user exists with that email but not as admin, promote them
    try {
      adminUserByEmail.role = "admin";
      await adminUserByEmail.save();
      console.log(`User ${adminCreds.email} promoted to admin`);
    } catch (err) {
      console.error(`Failed to promote user to admin: ${err.message}`);
    }
  }

  if (categoryCount === 0) {
    await MenuCategory.insertMany(defaultMenuCategories);
  }

  if (itemCount === 0) {
    await MenuItem.insertMany(defaultMenuItems);
  }

  if (!existingSettings) {
    await SiteSetting.create(defaultSiteSettings);
  }

  if (reviewCount === 0) {
    await Review.insertMany([
      {
        name: "Amina Rahman",
        email: "amina@example.com",
        message: "Fast delivery and the burgers were fresh and full of flavor.",
      },
      {
        name: "Sabbir Hasan",
        email: "sabbir@example.com",
        message: "Great late-night food option. The pasta and noodles were both excellent.",
      },
    ]);
  }
};
