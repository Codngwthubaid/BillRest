import express from "express";
import { createOrUpdateClinic, getClinicByUser } from "../controllers/clinic.controller.js"
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";
import { getAllClinics } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", verifyToken, checkRole(["clinic"]), checkSubscription, createOrUpdateClinic);
router.get("/", verifyToken, checkRole(["clinic"]), checkSubscription, getClinicByUser);
router.get("/allClinics", verifyToken, checkRole(["support", "master"]), getAllClinics);

export default router;
