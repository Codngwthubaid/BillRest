import express from "express";
import { createOrUpdateClinic, getClinicByUser } from "../controllers/clinic.controller.js"
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";
import { getAllClinics } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/all", verifyToken, checkRole(["support", "master"]), getAllClinics);

router.post("/", verifyToken, checkRole(["clinic"]), checkSubscription, createOrUpdateClinic);
router.get("/", verifyToken, checkRole(["clinic"]), checkSubscription, getClinicByUser);

export default router;
