import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";
import { getAllAppointments } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/allAppointments", verifyToken, checkRole(["support", "master"]), getAllAppointments);

router.post("/",
    verifyToken,
    checkRole(["clinic"]),
    checkSubscription,
    createAppointment
);

router.get("/",
    verifyToken,
    checkRole(["clinic"]),
    checkSubscription,
    getAppointments
);

router.put("/:id",
    verifyToken,
    checkRole(["clinic"]),
    checkSubscription,
    updateAppointment
);

router.delete("/:id",
    verifyToken,
    checkRole(["clinic"]),
    checkSubscription,
    deleteAppointment
);

router.get("/:id",
    verifyToken,
    checkRole(["clinic"]),
    checkSubscription,
    getAppointmentById
);

export default router;
