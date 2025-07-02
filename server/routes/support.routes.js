// routes/support.routes.js
import express from "express";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { createTicket, getMyTickets, getAllInvoices, getAllProducts, getTicketBySeriaNumber } from "../controllers/support.controller.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.use(verifyToken, checkRole(["customer"]), checkSubscription);

router.post("/", createTicket);
router.get("/", getMyTickets);
router.get("/products", getAllProducts);
router.get("/invoices", getAllInvoices);
router.get("/ticket/:serialNumber", getTicketBySeriaNumber)

export default router;
