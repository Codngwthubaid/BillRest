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
import { getAllProducts } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", verifyToken, checkRole(["customer"]), checkSubscription, createProduct);
router.get("/", verifyToken, checkRole(["customer"]), checkSubscription, getProducts);
router.get("/search", verifyToken, checkRole(["customer"]), checkSubscription, searchProducts);
router.put("/:id", verifyToken, checkRole(["customer"]), checkSubscription, updateProduct);
router.delete("/:id", verifyToken, checkRole(["customer"]), checkSubscription, deleteProduct);

router.get("/allProducts", verifyToken, checkRole(["support", "master"]), getAllProducts);

export default router;
