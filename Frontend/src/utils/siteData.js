import { assets, food_list, imageAssetMap, menu_list } from "../assets/assets";

const categorySlugMap = {
  Burger: "burger",
  Chicken: "chicken",
  Deserts: "deserts",
  Sandwich: "sandwich",
  Cake: "cake",
  Lassi: "lassi",
  "Pure Veg": "lassi",
  Pasta: "pasta",
  Noodles: "noodles",
};

export const defaultSiteSettings = {
  siteTitle: "Discover the taste of your favorite food at Tasty Town",
  siteSubtitle:
    "Order delicious meals, snacks, and desserts made to brighten your day. Fast delivery, fresh ingredients, and flavors you will keep coming back for.",
  heroBadge: "Fresh Flavors Daily",
  logoKey: "logo",
  logoUrl: "",
  contactLocation: "Khila Uttorbazar, Monohorgong, Comilla",
  footerText: "Copyright (c) Tasty Town Shop. All rights reserved.",
};

export const resolveImageSource = ({
  image,
  imageKey,
  imageUrl,
  fallback = assets.logo,
}) => image || imageAssetMap[imageKey] || imageUrl || fallback;

const normalizeCategorySlug = (name) =>
  categorySlugMap[name] || name.toLowerCase().replace(/\s+/g, "-");

export const buildFallbackCatalogData = () => ({
  settings: {
    ...defaultSiteSettings,
    logo: assets.logo,
  },
  categories: menu_list.map((item, index) => ({
    _id: `${item.menu_name}-${index}`,
    name: item.menu_name,
    slug: normalizeCategorySlug(item.menu_name),
    menu_name: item.menu_name,
    menu_image: item.menu_image,
    image: item.menu_image,
    sortOrder: index + 1,
    isActive: true,
  })),
  items: food_list.map((item, index) => ({
    ...item,
    categorySlug: normalizeCategorySlug(item.category),
    isAvailable: true,
    isFeatured: index < 10,
    sortOrder: index + 1,
  })),
  reviews: [],
});

export const hydrateCatalogData = (data) => {
  const fallback = buildFallbackCatalogData();
  const settings = {
    ...fallback.settings,
    ...(data?.settings || {}),
  };
  const categories = (data?.categories || fallback.categories).map((category, index) => ({
    ...category,
    _id: category._id || `${category.slug || category.name}-${index}`,
    name: category.name || category.menu_name,
    slug: category.slug || normalizeCategorySlug(category.name || category.menu_name),
    menu_name: category.name || category.menu_name,
    menu_image: resolveImageSource({
      image: category.menu_image,
      imageKey: category.imageKey,
      imageUrl: category.imageUrl,
      fallback: assets.logo,
    }),
  }));
  const categoryNameBySlug = Object.fromEntries(
    categories.map((category) => [category.slug, category.name]),
  );

  return {
    settings: {
      ...settings,
      logo: resolveImageSource({
        imageKey: settings.logoKey,
        imageUrl: settings.logoUrl,
        fallback: assets.logo,
      }),
    },
    categories,
    items: (data?.items || fallback.items).map((item, index) => ({
      ...item,
      _id: item._id || item.id || `${item.name}-${index}`,
      categorySlug: item.categorySlug || normalizeCategorySlug(item.category || ""),
      category:
        item.category ||
        item.categoryName ||
        categoryNameBySlug[item.categorySlug] ||
        item.categorySlug,
      image: resolveImageSource({
        image: item.image,
        imageKey: item.imageKey,
        imageUrl: item.imageUrl,
        fallback: assets.logo,
      }),
    })),
    reviews: data?.reviews || fallback.reviews,
  };
};
