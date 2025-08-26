import express from "express";
import { addBed, updateBed, deleteBed, getAllBeds, getBedById, getAllPatients } from "../controllers/bed.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js"
import { checkSubscription } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.post("/add", verifyToken, checkRole(["clinic"]), checkSubscription, addBed);
router.put("/update/:id", verifyToken, checkRole(["clinic"]), checkSubscription, updateBed);
router.delete("/delete/:id", verifyToken, checkRole(["clinic"]), checkSubscription, deleteBed);
router.get("/", verifyToken, checkRole(["clinic"]), checkSubscription, getAllBeds);
router.get("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, getBedById);
router.get("/patients/all", verifyToken, checkRole(["clinic"]), checkSubscription, getAllPatients);

export default router;
