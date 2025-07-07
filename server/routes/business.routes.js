import express from "express";
import { createOrUpdateBusiness, getBusinessByUser } from "../controllers/business.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";
import { getAllBusinesses } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", verifyToken, checkRole(["customer"]), checkSubscription, createOrUpdateBusiness);
router.get("/", verifyToken, checkRole(["customer"]), checkSubscription, getBusinessByUser);

router.get("/allBusinesses", verifyToken, checkRole(["support", "master"]), getAllBusinesses);

export default router;
