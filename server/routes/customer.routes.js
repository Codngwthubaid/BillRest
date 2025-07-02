import express from "express";
import { deleteCustomer, getCustomers } from "../controllers/customer.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"
import { checkSubscription } from "../middlewares/subscription.middleware.js"

const router = express.Router();

router.get("/", verifyToken, checkSubscription, getCustomers);
router.delete("/:id", verifyToken, checkSubscription, deleteCustomer);

export default router;
