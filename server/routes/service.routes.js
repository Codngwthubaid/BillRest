import express from "express";
import {
    createService,
    deleteService,
    getServices,
    updateService,
    searchServices
} from "../controllers/service.controller.js"

import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";
import { getAllServices } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", verifyToken, checkRole(["clinic"]), checkSubscription, createService);
router.get("/", verifyToken, checkRole(["clinic"]), checkSubscription, getServices);
router.get("/search", verifyToken, checkRole(["clinic"]), checkSubscription, searchServices);
router.put("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, updateService);
router.delete("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, deleteService);
router.get("/allServices", verifyToken, checkRole(["support", "master"]), getAllServices);

export default router;
