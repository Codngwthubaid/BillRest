import express from "express";
import { getPatients , deletePatient } from "../controllers/patient.controller.js";
import { checkRole, verifyToken } from "../middlewares/auth.middleware.js"
import { checkSubscription } from "../middlewares/subscription.middleware.js"
import { getAllPatients } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/", verifyToken, checkRole(["clinic"]), checkSubscription, getPatients);
router.delete("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, deletePatient);
router.get("/allPatients", verifyToken, checkRole(["support", "master"]), getAllPatients)

export default router;
