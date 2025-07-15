import express from "express";
import {
  createIPD,
  updateIPD,
  getIPDs,
  getIPDById,
  dischargeIPD
} from "../controllers/ipd.controller.js";

import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.post("/", verifyToken, checkRole(["clinic"]), checkSubscription, createIPD);
router.get("/", verifyToken, checkRole(["clinic"]), checkSubscription, getIPDs);
router.get("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, getIPDById);
router.put("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, updateIPD);
router.patch("/:id/discharge", verifyToken, checkRole(["clinic"]), checkSubscription, dischargeIPD);

export default router;
