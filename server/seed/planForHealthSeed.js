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
                role: "Clinic",
                durationInDays: 365,
                pricePerMonth: 699,
                totalPrice: 8388,
                includedInvoices: 300,
                description: [
                    "Patient Management",
                    "Basic Bill management",
                    "Medical record management (creation, updation, deletion)",
                    "Provider listing & management",
                    "View Reports for patient demographics, billing, revenue, and status",
                    "Support for medical inquiries and compliance questions"
                ]
            },
            {
                name: "3 Months",
                type: "package",
                role: "Clinic",
                durationInDays: 90,
                pricePerMonth: 999,
                totalPrice: 2997,
                includedInvoices: 300,
                description: [
                    "Patient Management",
                    "Basic Bill management",
                    "Medical record management (creation, updation, deletion)",
                    "Provider listing & management",
                    "View Reports for patient demographics, billing, revenue, and status",
                    "Support for medical inquiries and compliance questions"
                ]
            },
            {
                name: "12 Months",
                type: "package",
                role: "Hospital",
                durationInDays: 365,
                pricePerMonth: 1199,
                totalPrice: 14388,
                includedInvoices: 300,
                description: [
                    "Patient Management",
                    "Billing management with IPD",
                    "Medical record management (creation, updation, deletion)",
                    "Provider listing & management",
                    "View Reports for patient demographics, billing, revenue, and status",
                    "Support for medical inquiries and compliance questions"
                ]
            },
            {
                name: "3 Months",
                type: "package",
                role: "Hospital",
                durationInDays: 90,
                pricePerMonth: 1799,
                totalPrice: 5397,
                includedInvoices: 300,
                description: [
                    "Patient Management",
                    "Billing management With IPD ",
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
