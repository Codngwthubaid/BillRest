import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../controllers/product.controller.js";

import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";

const router = express.Router();

// Only accessible by 'customer' users
router.use(verifyToken, checkRole(["customer", "support" , "master"]), checkSubscription);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/search", searchProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
