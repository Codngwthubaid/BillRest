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
app.use("/api/admin" , adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/plans", planRoutes);



app.get("/", (req, res) => res.send("🚀 Billing Software Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));







// 1. **✅ Authentication System** (Completed)
// 2. **✅ Business Onboarding** (Completed)
// 3. **🟡 Product Management**
// 4. **🟡 Invoice System**
// 5. **🟡 Sales Reports**
// 6. **🟡 WhatsApp Messaging Integration**
// 7. **🟡 PWA Sync Logic (optional backend part)**
// for 7 -
// ✅ Use Service Workers on frontend to capture offline events.

// ✅ Store offline invoices in IndexedDB or localStorage.

// ✅ When online, hit /api/sync/invoices with offline data.

// ✅ Show sync status in the frontend.

// 8. **🟡 Admin Dashboards Data APIs**
// 9. **🟡 Deployment Scripts (PM2 + Nginx)**

