import { Invoice } from "../models/invoice.model.js";

export const getSalesReport = async (req, res) => {
    try {
        const { filterType, startDate, endDate } = req.query;
        const userId = req.user.id;

        let start, end;

        const now = new Date();

        switch (filterType) {
            case "daily":
                start = new Date(startDate);
                end = new Date(startDate);
                end.setDate(end.getDate() + 1);
                break;

            case "weekly":
                start = new Date(startDate);
                end = new Date(startDate);
                end.setDate(end.getDate() + 7);
                break;

            case "monthly":
                start = new Date(startDate);
                start.setDate(1);
                end = new Date(start);
                end.setMonth(end.getMonth() + 1);
                break;

            case "quarterly":
                const quarter = Math.floor((now.getMonth() + 3) / 3);
                start = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
                end = new Date(start);
                end.setMonth(end.getMonth() + 3);
                break;

            case "yearly":
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear() + 1, 0, 1);
                break;

            case "financial":
                if (now.getMonth() < 3) {
                    start = new Date(now.getFullYear() - 1, 3, 1);
                    end = new Date(now.getFullYear(), 3, 1);
                } else {
                    start = new Date(now.getFullYear(), 3, 1);
                    end = new Date(now.getFullYear() + 1, 3, 1);
                }
                break;

            case "custom":
                start = new Date(startDate);
                end = new Date(endDate);
                break;

            default:
                return res.status(400).json({ message: "Invalid filter type" });
        }

        const invoices = await Invoice.find({
            user: userId,
            createdAt: { $gte: start, $lte: end },
        }).populate("products.product");

        // Optional: calculate totals or group by products
        const totalSales = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

        // 🔍 Compute Top 5 Products
        const productMap = {};

        invoices.forEach((invoice) => {
            invoice.products.forEach((item) => {
                const name = item.product?.name;

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
        console.error(err);
        res.status(500).json({ message: "Error generating report" });
    }
};
