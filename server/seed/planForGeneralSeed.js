import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { PlanForGeneral } from "../models/planForGeneral.model.js";

dotenv.config();

const seedPlans = async () => {
  try {
    await connectDB();
    await PlanForGeneral.deleteMany();

    await PlanForGeneral.insertMany([
      {
        name: "12 Months",
        type: "package",
        durationInDays: 365,
        pricePerMonth: 399,
        totalPrice: 4788,
        includedInvoices: 300,
        description: [
          "Business Management",
          "Invoice management (creation, updation, deletion)",
          "Product management (creation, updation, deletion)",
          "Customer listing & management",
          "View Reports for sales, revenue, product, status",
          "Asked queries from the support panel"
        ]
      },
      {
        name: "6 Months",
        type: "package",
        durationInDays: 180,
        pricePerMonth: 699,
        totalPrice: 4194,
        includedInvoices: 300,
        description: [
          "Business Management",
          "Invoice management (creation, updation, deletion)",
          "Product management (creation, updation, deletion)",
          "Customer listing & management",
          "View Reports for sales, revenue, product, status",
          "Asked queries from the support panel"
        ]
      },
      {
        name: "1 Months",
        type: "package",
        durationInDays: 30,
        pricePerMonth: 999,
        totalPrice: 999,
        includedInvoices: 300,
        description: [
          "Business Management",
          "Invoice management (creation, updation, deletion)",
          "Product management (creation, updation, deletion)",
          "Customer listing & management",
          "View Reports for sales, revenue, product, status",
          "Asked queries from the support panel"
        ]
      },
      {
        name: "WA Add On",
        type: "individual",
        pricePerMonth: 249,
        totalPrice: 249,
        includedInvoices: 700,
        description: "700 WhatsApp invoices"
      },
      {
        name: "Dedicated Account Manager",
        type: "individual",
        pricePerMonth: 399,
        totalPrice: 399,
        description: "DAM support"
      },
    ]);

    console.log("✅ Plans with detailed package descriptions seeded");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedPlans();
