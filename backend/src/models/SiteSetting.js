import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: "default",
    },
    siteTitle: {
      type: String,
      required: true,
      trim: true,
    },
    siteSubtitle: {
      type: String,
      required: true,
      trim: true,
    },
    heroBadge: {
      type: String,
      default: "",
      trim: true,
    },
    logoKey: {
      type: String,
      default: "",
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    contactLocation: {
      type: String,
      default: "",
      trim: true,
    },
    footerText: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("SiteSetting", siteSettingSchema);
