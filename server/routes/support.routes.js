// routes/support.routes.js
import express from "express";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { createTicket, getMyTickets } from "../controllers/support.controller.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.use(verifyToken, checkRole(["customer"]), checkSubscription);

router.post("/", createTicket);
router.get("/", getMyTickets);

export default router;
