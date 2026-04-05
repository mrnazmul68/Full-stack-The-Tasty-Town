import { verifyAdminToken } from "../utils/adminAuth.js";

const requireAdmin = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization || "";
    const token = authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.slice(7)
      : "";

    const admin = verifyAdminToken(token);
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({
      message: error.message || "Admin authorization failed.",
    });
  }
};

export default requireAdmin;
