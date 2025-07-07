import express from "express";
import { deleteCustomer, getCustomers } from "../controllers/customer.controller.js";
import { checkRole, verifyToken } from "../middlewares/auth.middleware.js"
import { checkSubscription } from "../middlewares/subscription.middleware.js"
import { getAllCutomers } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/", verifyToken, checkRole(["customer"]), checkSubscription, getCustomers);
router.delete("/:id", verifyToken, checkRole(["customer"]), checkSubscription, deleteCustomer);

router.get("/allCustomers", verifyToken, checkRole(["support", "master"]), getAllCutomers)

export default router;
