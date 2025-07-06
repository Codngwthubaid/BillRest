import express from "express";
import { createOrUpdateBusiness, getBusinessByUser } from "../controllers/business.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";

const router = express.Router();

// Only accessible by customer role
router.use(verifyToken, checkRole(["customer"]), checkSubscription);

router.post("/", createOrUpdateBusiness);
router.get("/", getBusinessByUser);

export default router;
