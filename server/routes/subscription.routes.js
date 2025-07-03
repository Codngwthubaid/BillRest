import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    getUserSubscription
} from "../controllers/subscription.controller.js";

const router = express.Router();

router.get("/", verifyToken, getUserSubscription);

export default router;

