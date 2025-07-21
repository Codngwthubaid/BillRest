import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Token verification error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const checkRole = (roles) => (req, res, next) => {
  const userRole = String(req.user?.role).trim();
  console.log("Allowed roles:", roles);
  console.log("User role:", userRole);

  if (!roles.includes(userRole)) {
    console.log("❌ Role not allowed:", userRole);
    return res.status(403).json({ message: "Access denied" });
  }
  console.log("✅ Access Granted", userRole);
  next();
};
