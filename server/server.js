import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import businessRoutes from "./routes/business.routes.js";
import productRoutes from "./routes/product.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import reportRoutes from "./routes/report.routes.js";
import syncRoutes from "./routes/sync.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import planRoutes from "./routes/plan.routes.js";
import supportRoutes from "./routes/support.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import customerRoutes from "./routes/customer.routes.js"
import appointmentRoutes from "./routes/appointment.routes.js"
import serviceRoutes from "./routes/service.routes.js"
import patientRoutes from "./routes/patient.routes.js"
import clinicRoutes from "./routes/clinic.routes.js"
import ipdRoutes from "./routes/ipd.routes.js"
import bedRoutes from "./routes/bed.routes.js";

dotenv.config();
const app = express();
connectDB();

// Middleware
app.use(cors(
    {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    }
));
app.use(express.json()); // ✅ Required for parsing JSON bodies


// Routes
app.use("/api/report", reportRoutes);
app.use("/api/admin" , adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/clinic", clinicRoutes)
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/customers",customerRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/patients", patientRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/ipd", ipdRoutes)
app.use("/api/bed", bedRoutes);


app.get("/", (_, res) => res.send("🚀 Billing Software Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


