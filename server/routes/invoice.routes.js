import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  downloadInvoicePDF,
  sendInvoiceWhatsApp,
  updateInvoice,
  deleteInvoice,
  printInvoicePDF,
  printInvoicePage
} from "../controllers/invoice.controller.js";
import { downloadPOSReceiptPDF } from "../controllers/pos.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkFeatureAccess } from "../middlewares/feature.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";
import { getAllInvoices } from "../controllers/admin.controller.js";


const router = express.Router();

router.get("/allInvoices", verifyToken, checkRole(["support", "master"]), getAllInvoices);
router.post("/send-whatsapp/:invoiceId", verifyToken, checkRole(["customer"]), checkSubscription, checkFeatureAccess("whatsappInvoice"), sendInvoiceWhatsApp);


router.post("/", verifyToken, checkRole(["customer"]), checkSubscription, createInvoice);
router.get("/", verifyToken, checkRole(["customer"]), checkSubscription, getInvoices);
router.put("/:id", verifyToken, checkRole(["customer"]), checkSubscription, updateInvoice);
router.delete("/:id", verifyToken, checkRole(["customer"]), checkSubscription, deleteInvoice);
router.get("/:id", verifyToken, checkRole(["customer"]), checkSubscription, getInvoiceById);
router.get("/:id/download", verifyToken, checkRole(["customer"]), checkSubscription, downloadInvoicePDF);
router.get("/:id/pos-pdf", verifyToken, checkRole(["customer"]), checkSubscription, downloadPOSReceiptPDF);
router.get("/:id/print", verifyToken, checkRole(["customer"]), checkSubscription, printInvoicePDF);


// not usen
router.get("/:id/print-page", verifyToken, checkRole(["customer"]), checkSubscription, printInvoicePage);
export default router;
