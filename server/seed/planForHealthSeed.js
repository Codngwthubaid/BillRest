import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { PlanForHealth } from "../models/planForHealth.model.js";

dotenv.config();

const seedPlans = async () => {
    try {
        await connectDB();
        await PlanForHealth.deleteMany();

        await PlanForHealth.insertMany([
            {
                name: "12 Months",
                type: "package",
                durationInDays: 365,
                pricePerMonth: 799,
                totalPrice: 9588,
                includedInvoices: 300,
                description: [
                    "Patient Management",
                    "Invoice management (creation, updation, deletion)",
                    "Medical record management (creation, updation, deletion)",
                    "Provider listing & management",
                    "View Reports for patient demographics, billing, revenue, and status",
                    "Support for medical inquiries and compliance questions"
                ]
            },
            {
                name: "6 Months",
                type: "package",
                durationInDays: 180,
                pricePerMonth: 999,
                totalPrice: 5994,
                includedInvoices: 300,
                description: [
                    "Patient Management",
                    "Invoice management (creation, updation, deletion)",
                    "Medical record management (creation, updation, deletion)",
                    "Provider listing & management",
                    "View Reports for patient demographics, billing, revenue, and status",
                    "Support for medical inquiries and compliance questions"
                ]
            },
            {
                name: "3 Months",
                type: "package",
                durationInDays: 90,
                pricePerMonth: 1199,
                totalPrice: 3597,
                includedInvoices: 300,
                description: [
                    "Patient Management",
                    "Invoice management (creation, updation, deletion)",
                    "Medical record management (creation, updation, deletion)",
                    "Provider listing & management",
                    "View Reports for patient demographics, billing, revenue, and status",
                    "Support for medical inquiries and compliance questions"
                ]
            },
            {
                name: "WA Add On",
                type: "individual",
                pricePerMonth: 249,
                totalPrice: 249,
                includedInvoices: 700,
                description: "700 WhatsApp invoices for patient communication"
            },
            {
                name: "Dedicated Account Manager",
                type: "individual",
                pricePerMonth: 399,
                totalPrice: 399,
                description: "DAM support for specialized healthcare advice and compliance"
            }
        ]);

        console.log("✅ Plans with detailed package descriptions seeded");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }
};

seedPlans();
