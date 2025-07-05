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


const router = express.Router();

// Only for customers
router.use(verifyToken, checkRole(["customer"]), checkSubscription);

router.post("/", createInvoice);
router.get("/", getInvoices);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);
router.get("/:id", getInvoiceById);
router.get("/:id/download", downloadInvoicePDF);
router.get("/:id/pos-pdf", downloadPOSReceiptPDF);
router.get("/:id/print", verifyToken, printInvoicePDF);

// not usen
router.get("/:id/print-page", verifyToken, printInvoicePage);


// ✅ Feature-gated route for WhatsApp invoice sending
router.post(
  "/send-whatsapp/:invoiceId",
  checkFeatureAccess("whatsappInvoice"),
  sendInvoiceWhatsApp
);

export default router;
