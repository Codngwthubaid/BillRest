import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  downloadAppointmentPDF,
  sendAppointmentWhatsApp,
  updateAppointment,
  deleteAppointment,
  printAppointmentPDF,
} from "../controllers/appointment.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { checkFeatureAccess } from "../middlewares/feature.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";
// import { getAllAppointments } from "../controllers/admin.controller.js";

const router = express.Router();

// Admin support route
// router.get("/allAppointments", verifyToken, checkRole(["support", "master"]), getAllAppointments);

// WhatsApp sending (limit check, feature check etc)
router.post("/send-whatsapp/:appointmentId",
    verifyToken,
    checkRole(["clinic"]),
    checkSubscription,
    checkFeatureAccess("whatsappInvoice"),
    sendAppointmentWhatsApp
);

// Core CRUD routes
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

router.get("/:id/download",
    verifyToken,
    checkRole(["clinic"]),
    checkSubscription,
    downloadAppointmentPDF
);

router.get("/:id/print",
    verifyToken,
    checkRole(["clinic"]),
    checkSubscription,
    printAppointmentPDF
);

// not used - just for consistency
// router.get("/:id/print-page",
//     verifyToken,
//     checkRole(["clinic"]),
//     checkSubscription,
//     printAppointmentPage
// );

export default router;
