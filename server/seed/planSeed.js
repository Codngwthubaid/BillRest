import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Plan } from "../models/plan.model.js";

dotenv.config();


const seedPlans = async () => {
  try {
    await connectDB(); // Use the existing connection logic

    await Plan.deleteMany();

    await Plan.insertMany([
      { name: "3 Months", durationInDays: 90, price: 3000 },
      { name: "6 Months", durationInDays: 180, price: 5000 },
      { name: "1 Year", durationInDays: 365, price: 8000 },
    ]);

    console.log("✅ Plans seeded");
    process.exit();
  } catch (err) {
    console.error("❌ Plan seeding failed:", err.message);
    process.exit(1);
  }
};

seedPlans();
