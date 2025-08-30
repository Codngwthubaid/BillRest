import express from "express";
import {
  createIPD,
  updateIPD,
  getIPDs,
  getIPDById,
  // dischargeIPD,
  deleteIPD,
  downloadIPDPDF,
  printIPDPDF,
  createOPD,
  updateOPD,
  printOPDPDF,
  downloadOPDPDF
} from "../controllers/ipd.controller.js";

import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";
import { getAllIPDs } from "../controllers/admin.controller.js";

const router = express.Router();


router.get("/all", verifyToken, checkRole(["support", "master"]), getAllIPDs);


router.post("/createOPD", verifyToken, checkRole(["clinic"]), checkSubscription, createOPD);
router.post("/", verifyToken, checkRole(["clinic"]), checkSubscription, createIPD);
router.get("/", verifyToken, checkRole(["clinic"]), checkSubscription, getIPDs);
router.get("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, getIPDById);
router.put("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, updateIPD);
router.put("/updateOPD/:id", verifyToken, checkRole(["clinic"]), checkSubscription, updateOPD);
// router.patch("/:id/discharge", verifyToken, checkRole(["clinic"]), checkSubscription, dischargeIPD);
router.delete("/:id", verifyToken, checkRole(["clinic"]), checkSubscription, deleteIPD);
router.get("/:id/download-pdf", verifyToken, checkRole(["clinic"]), checkSubscription, downloadIPDPDF);
router.get("/:id/print-pdf", verifyToken, checkRole(["clinic"]), checkSubscription, printIPDPDF);
router.get("/:id/opd/download-pdf", verifyToken, checkRole(["clinic"]), checkSubscription, downloadOPDPDF);
router.get("/:id/opd/print-pdf", verifyToken, checkRole(["clinic"]), checkSubscription, printOPDPDF);

export default router;
