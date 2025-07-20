import express from "express";
import {
  createIPD,
  updateIPD,
  getIPDs,
  getIPDById,
  dischargeIPD,
  deleteIPD,
  downloadIPDPDF,
  printIPDPDF
} from "../controllers/ipd.controller.js";

import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";
import { getAllIPDs } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", verifyToken, checkRole(["clinic"]), checkSubscription, createIPD);
router.get("/", verifyToken, checkRole(["clinic"]), checkSubscription, getIPDs);
router.get("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, getIPDById);
router.put("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, updateIPD);
router.patch("/:id/discharge", verifyToken, checkRole(["clinic"]), checkSubscription, dischargeIPD);
router.delete("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, deleteIPD);
router.get("/:id/download-pdf", verifyToken, checkRole(["clinic"]), checkSubscription, downloadIPDPDF);
router.get("/:id/print-pdf", verifyToken, checkRole(["clinic"]), checkSubscription, printIPDPDF);

router.get("/allIPDs", verifyToken, checkRole(["support", "master"]), getAllIPDs);

export default router;
