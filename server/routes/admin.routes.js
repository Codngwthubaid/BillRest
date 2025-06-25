import express from "express";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { updateCustomerFeatures } from "../controllers/admin.controller.js";

const router = express.Router();

router.put("/customers/:customerId/features", verifyToken, checkRole(["admin"]), updateCustomerFeatures);

export default router;