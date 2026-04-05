import MenuCategory from "../models/MenuCategory.js";
import MenuItem from "../models/MenuItem.js";
import Review from "../models/Review.js";
import SiteSetting from "../models/SiteSetting.js";
import {
  defaultMenuCategories,
  defaultMenuItems,
  defaultSiteSettings,
} from "../data/defaultCatalog.js";

export const ensureDefaultAppData = async () => {
  const [categoryCount, itemCount, reviewCount, existingSettings] = await Promise.all([
    MenuCategory.countDocuments(),
    MenuItem.countDocuments(),
    Review.countDocuments(),
    SiteSetting.findOne({ key: "default" }),
  ]);

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
