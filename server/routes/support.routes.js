// routes/support.routes.js
import express from "express";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { createTicket, getMyTickets, getTicketBySeriaNumber } from "../controllers/support.controller.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";
import { getAllSupportTickets, updateTicketStatus } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", verifyToken, checkRole(["customer"]), checkSubscription, createTicket);
router.get("/", verifyToken, checkRole(["customer"]), checkSubscription, getMyTickets);
router.get("/ticket/:serialNumber", verifyToken, checkRole(["customer"]), checkSubscription, getTicketBySeriaNumber)

router.put("/tickets/:id", verifyToken, checkRole(["support", "master"]), updateTicketStatus);
router.get("/allTickets", verifyToken, checkRole(["support", "master"]), getAllSupportTickets);

export default router;
