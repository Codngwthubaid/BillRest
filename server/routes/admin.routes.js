import express from "express";
import {
  getDashboardStats,
  getAllBusinesses,
  toggleBusinessActive,
  updateBusinessFeatures,
  getAllSupportTickets,
  updateTicketStatus,
  updateCustomerFeatures,
  getAllInvoices,
  getAllProducts,
  getGlobalSalesReport,
  getBusinessOverview
} from "../controllers/admin.controller.js";

import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Only allow master admin
router.use(verifyToken, checkRole(["master"]));

router.get("/dashboard", getDashboardStats);
router.get("/businesses", getAllBusinesses);
router.patch("/businesses/:id/toggle", toggleBusinessActive);
router.patch("/businesses/:id/features", updateBusinessFeatures);
router.put("/customers/:customerId/features", updateCustomerFeatures);
router.get("/tickets", getAllSupportTickets);
router.patch("/tickets/:id", updateTicketStatus);
router.get("/invoices", getAllInvoices);
router.get("/products", getAllProducts);
router.get("/reports/sales", getGlobalSalesReport);
router.get("/businesses/:id/overview", getBusinessOverview);

export default router;
