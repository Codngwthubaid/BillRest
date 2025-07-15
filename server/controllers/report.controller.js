import { Invoice } from "../models/invoice.model.js";
import { IPD } from "../models/ipd.model.js";

export const getSalesReportForGeneral = async (req, res) => {
    try {
        const { filterType, startDate, endDate } = req.query;
        const userId = req.user.id;

        let start, end;
        const now = new Date();

        switch (filterType) {
            case "daily":
                start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setHours(23, 59, 59, 999);
                break;

            case "weekly":
                start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setDate(end.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                break;

            case "monthly":
                start = new Date(startDate);
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setMonth(end.getMonth() + 1);
                end.setDate(0);
                end.setHours(23, 59, 59, 999);
                break;

            case "quarterly":
                const quarter = Math.floor((now.getMonth() + 3) / 3);
                start = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setMonth(end.getMonth() + 3);
                end.setDate(0);
                end.setHours(23, 59, 59, 999);
                break;

            case "yearly":
                start = new Date(now.getFullYear(), 0, 1);
                start.setHours(0, 0, 0, 0);
                end = new Date(now.getFullYear() + 1, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;

            case "financial":
                if (now.getMonth() < 3) {
                    start = new Date(now.getFullYear() - 1, 3, 1);
                    end = new Date(now.getFullYear(), 2, 31);
                } else {
                    start = new Date(now.getFullYear(), 3, 1);
                    end = new Date(now.getFullYear() + 1, 2, 31);
                }
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;

            case "custom":
                start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                break;

            default:
                return res.status(400).json({ message: "Invalid filter type" });
        }

        const invoices = await Invoice.find({
            user: userId,
            // createdAt: { $gte: start, $lte: end },
        });
        const totalSales = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

        // 🔍 Compute Top 5 Products
        const productMap = {};

        invoices.forEach((invoice) => {
            invoice.products.forEach((item) => {
                const name = item.name;
                if (!productMap[name]) {
                    productMap[name] = {
                        name,
                        quantity: 0,
                        totalSales: 0,
                    };
                }
                productMap[name].quantity += item.quantity;
                productMap[name].totalSales += item.quantity * item.price;
            });
        });

        const topProducts = Object.values(productMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        res.json({
            totalSales,
            count: invoices.length,
            topProducts,
            invoices,
        });
    } catch (err) {
        console.error("❌ Error generating report:", err);
        res.status(500).json({ message: "Error generating report" });
    }
};

export const getSalesReportForHealth = async (req, res) => {
    try {
        const { filterType, startDate, endDate } = req.query;
        const userId = req.user.id;

        let start, end;
        const now = new Date();

        switch (filterType) {
            case "daily":
                start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setHours(23, 59, 59, 999);
                break;
            case "weekly":
                start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setDate(end.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                break;
            case "monthly":
                start = new Date(startDate);
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setMonth(end.getMonth() + 1);
                end.setDate(0);
                end.setHours(23, 59, 59, 999);
                break;
            case "quarterly":
                const quarter = Math.floor((now.getMonth() + 3) / 3);
                start = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setMonth(end.getMonth() + 3);
                end.setDate(0);
                end.setHours(23, 59, 59, 999);
                break;
            case "yearly":
                start = new Date(now.getFullYear(), 0, 1);
                start.setHours(0, 0, 0, 0);
                end = new Date(now.getFullYear() + 1, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case "financial":
                if (now.getMonth() < 3) {
                    start = new Date(now.getFullYear() - 1, 3, 1);
                    end = new Date(now.getFullYear(), 2, 31);
                } else {
                    start = new Date(now.getFullYear(), 3, 1);
                    end = new Date(now.getFullYear() + 1, 2, 31);
                }
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case "custom":
                start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                break;
            default:
                return res.status(400).json({ message: "Invalid filter type" });
        }

        // 🗂 Fetch IPDs for clinic within range
        const ipds = await IPD.find({
            clinic: userId,
            createdAt: { $gte: start, $lte: end }
        })
            .populate("clinic", "-password")
            .populate("patient")
            .populate("treatments.service");

        // 💰 Compute total revenue from all billing
        const totalRevenue = ipds.reduce((sum, ipd) => {
            return sum + (ipd.billing.total || 0);
        }, 0);

        // 📊 Compute top services
        const serviceMap = {};

        ipds.forEach(ipd => {
            ipd.treatments.forEach(treatment => {
                if (treatment.service && treatment.service.name) {
                    const key = treatment.service.name;
                    if (!serviceMap[key]) {
                        serviceMap[key] = {
                            name: key,
                            quantity: 0,
                            totalSales: 0
                        };
                    }
                    serviceMap[key].quantity += treatment.quantity;
                    serviceMap[key].totalSales += (treatment.totalCharges || 0);
                }
            });
        });

        const topServices = Object.values(serviceMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        res.json({
            totalRevenue,
            count: ipds.length,
            topServices,
            ipds
        });

    } catch (err) {
        console.error("❌ Error generating health report:", err);
        res.status(500).json({ message: "Error generating report" });
    }
};
