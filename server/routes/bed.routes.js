import express from "express";
import { addBed, updateBed, deleteBed } from "../controllers/bed.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js"
import { checkSubscription } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.post("/add", verifyToken, checkRole(["clinic"]), checkSubscription, addBed);
router.put("/update/:id", verifyToken, checkRole(["clinic"]), checkSubscription, updateBed);
router.delete("/delete/:id", verifyToken, checkRole(["clinic"]), checkSubscription, deleteBed);

export default router;
