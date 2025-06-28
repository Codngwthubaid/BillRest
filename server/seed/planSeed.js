import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Plan } from "../models/plan.model.js";

dotenv.config();

const seedPlans = async () => {
  try {
    await connectDB();
    await Plan.deleteMany();

    await Plan.insertMany([
      {
        name: "1 Month",
        type: "package",
        durationInDays: 30,
        pricePerMonth: 1249,
        totalPrice: 1249,
        includedInvoices: 300
      },
      {
        name: "3 Months",
        type: "package",
        durationInDays: 90,
        pricePerMonth: 1199,
        totalPrice: 3597,
        includedInvoices: 300
      },

      {
        name: "6 Months",
        type: "package",
        durationInDays: 180,
        pricePerMonth: 999,
        totalPrice: 5994,
        includedInvoices: 300
      },
      {
        name: "12 Months",
        type: "package",
        durationInDays: 365,
        pricePerMonth: 799,
        totalPrice: 9588,
        includedInvoices: 300
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
      {
        name: "Call Support",
        type: "individual",
        pricePerMonth: 199,
        totalPrice: 199,
        description: "CPS - Call support for software"
      },
      {
        name: "WA + CPS Combo",
        type: "individual",
        pricePerMonth: 349,
        totalPrice: 349,
        description: "WhatsApp + Call support"
      },
    ]);

    console.log("✅ Plans with monthly & total prices seeded");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedPlans();
