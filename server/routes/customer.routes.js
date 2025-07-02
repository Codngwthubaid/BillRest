import express from "express";
import { getCustomers } from "../controllers/customer.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"
import { checkSubscription } from "../middlewares/subscription.middleware.js"

const router = express.Router();

router.get("/", verifyToken, checkSubscription, getCustomers);

export default router;
