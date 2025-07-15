import express from "express";
import {
  getDashboardStats,
  getAllBusinesses,
  toggleBusinessActive,
  updateBusinessFeatures,
  updateCustomerFeatures,
  getAllInvoices,
  getAllProducts,
  getGlobalSalesReport,
  getBusinessOverview,
  getAllCutomers,
  getAllSupportTicketsForGeneral,
  updateTicketStatusForGeneral,
  getAllSupportTicketsForHealth,
  updateTicketStatusForHealth
} from "../controllers/admin.controller.js";

import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Only allow master admin
router.use(verifyToken, checkRole(["master"]));

router.get("/dashboard", getDashboardStats);
router.get("/businesses", getAllBusinesses);
router.patch("/businesses/:id/toggle", toggleBusinessActive);
router.patch("/businesses/:id/features", updateBusinessFeatures);
router.get("/general/tickets", getAllSupportTicketsForGeneral);
router.patch("/general/tickets/:id", updateTicketStatusForGeneral);
router.get("/health/tickets", getAllSupportTicketsForHealth);
router.patch("/health/tickets/:id", updateTicketStatusForHealth);
router.get("/invoices", getAllInvoices);
router.get("/products", getAllProducts);
router.get("/reports/sales", getGlobalSalesReport);
router.get("/businesses/:id/overview", getBusinessOverview);
router.get("/customers", getAllCutomers)


// not used
router.put("/customers/:customerId/features", updateCustomerFeatures);

export default router;
