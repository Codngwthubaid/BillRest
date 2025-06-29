import express from "express";
import { register, login, getUserSubscription } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/subscription", verifyToken, getUserSubscription);

export default router;
