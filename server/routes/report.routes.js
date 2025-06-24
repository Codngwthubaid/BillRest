import express from "express";
import { getSalesReport } from "../controllers/report.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/sales", verifyToken, getSalesReport);

export default router;
