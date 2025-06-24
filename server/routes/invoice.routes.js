import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
} from "../controllers/invoice.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Only for customers
router.use(verifyToken, checkRole(["customer"]));

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);

export default router;
