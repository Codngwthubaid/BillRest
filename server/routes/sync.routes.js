import express from "express";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { syncInvoices, getSyncProducts } from "../controllers/sync.controller.js";

const router = express.Router();

router.use(verifyToken, checkRole(["customer"]));

router.post("/invoices", syncInvoices);   // Sync offline invoices
router.get("/products", getSyncProducts); // Get updated product list

export default router;
