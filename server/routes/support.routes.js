import express from "express";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";
import { getAllSupportTicketsForGeneral, getAllSupportTicketsForHealth } from "../controllers/admin.controller.js";
import {
    createTicketForGeneral,
    updateTicketStatusForGeneral,
    getMyTicketsForGeneral,
    getTicketBySeriaNumberForGeneral,
    getHealthTicketBySerialNumber,
    getMyHealthTickets,
    updateHealthTicketStatus,
    createTicketForHealth,
    sendMsgToAdmin,
    getAllMessagesForTicket
} from "../controllers/support.controller.js";

const router = express.Router();

router.post("/general", verifyToken, checkRole(["customer"]), checkSubscription, createTicketForGeneral);
router.get("/general", verifyToken, checkRole(["customer"]), checkSubscription, getMyTicketsForGeneral);
router.get("/general/ticket/:serialNumber", verifyToken, checkRole(["customer"]), checkSubscription, getTicketBySeriaNumberForGeneral)
router.post("/health", verifyToken, checkRole(["clinic"]), checkSubscription, createTicketForHealth);
router.get("/health", verifyToken, checkRole(["clinic"]), checkSubscription, getMyHealthTickets);
router.get("/health/ticket/:serialNumber", verifyToken, checkRole(["clinic"]), checkSubscription, getHealthTicketBySerialNumber)

router.post("/sendMsgToAdmin", verifyToken, checkRole(["support"]), sendMsgToAdmin)
router.get("/messages/:ticketType/:ticketId", verifyToken, checkRole(["master"]), getAllMessagesForTicket);
router.put("/general/tickets/:id", verifyToken, checkRole(["support", "master"]), updateTicketStatusForGeneral);
router.get("/general/allTickets", verifyToken, checkRole(["support", "master"]), getAllSupportTicketsForGeneral);
router.put("/health/tickets/:id", verifyToken, checkRole(["support", "master"]), updateHealthTicketStatus);
router.get("/health/allTickets", verifyToken, checkRole(["support", "master"]), getAllSupportTicketsForHealth);

export default router;
