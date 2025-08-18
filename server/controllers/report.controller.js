import { Invoice } from "../models/invoice.model.js";
import { Appointment } from "../models/appointment.model.js";
import { Patient } from "../models/patient.model.js";
import { Service } from "../models/service.model.js";
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

        // Fetch counts independently
        const [appointments, patients, services, ipds] = await Promise.all([
            Appointment.find({
                clinic: userId,
                // createdAt: { $gte: start, $lte: end }
            }).populate("patient"),
            Patient.find({
                clinic: userId,
                // createdAt: { $gte: start, $lte: end }
            }),
            Service.find({
                clinic: userId,
                // createdAt: { $gte: start, $lte: end }
            }),
            IPD.find({
                clinic: userId,
                // createdAt: { $gte: start, $lte: end }
            })
                .populate("clinic", "-password")
                .populate("patient")
                .populate("appointment")
                .populate("treatments.service")
        ]);

        // 💰 Total revenue
        const totalRevenue = ipds.reduce((sum, ipd) => sum + (ipd.billing.total || 0), 0);

        // 📊 Top services from IPD
        const serviceMap = {};
        ipds.forEach(ipd => {
            ipd.treatments.forEach(treatment => {
                if (treatment.service && treatment.service.name) {
                    const key = treatment.service.name;
                    if (!serviceMap[key]) {
                        serviceMap[key] = { name: key, quantity: 0, totalSales: 0 };
                    }
                    serviceMap[key].quantity += treatment.quantity;
                    serviceMap[key].totalSales += (treatment.totalCharges || 0);
                }
            });
        });
        const topServices = Object.values(serviceMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        // 🧑‍⚕️ Top patients by number of appointments
        const patientMap = {};
        appointments.forEach(app => {
            if (app.patient && app.patient._id) {
                const key = app.patient._id.toString();
                if (!patientMap[key]) {
                    patientMap[key] = {
                        _id: app.patient._id,
                        name: app.patient.name,
                        phoneNumber: app.patient.phoneNumber,
                        visits: 0
                    };
                }
                patientMap[key].visits += 1;
            }
        });
        const topPatients = Object.values(patientMap)
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 5);

        // 📅 Top appointments by type
        const appointmentMap = {};
        appointments.forEach(app => {
            if (app.description) {  // or any other field like app.type
                const key = app.description;
                if (!appointmentMap[key]) {
                    appointmentMap[key] = { description: key, count: 0 };
                }
                appointmentMap[key].count += 1;
            }
        });
        const topAppointments = Object.values(appointmentMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        console.log({
            totalRevenue,
            count: ipds.length,
            topServices,
            ipds,
            appointments,
            patients,
            services,
            totalAppointments: appointments.length,
            totalPatients: patients.length,
            totalServices: services.length,
            topPatients,
            topAppointments
        })

        res.json({
            totalRevenue,
            count: ipds.length,
            topServices,
            ipds,
            appointments,
            patients,
            services,
            totalAppointments: appointments.length,
            totalPatients: patients.length,
            totalServices: services.length,
            topPatients,
            topAppointments
        });

    } catch (err) {
        console.error("❌ Error generating health report:", err);
        res.status(500).json({ message: "Error generating report" });
    }
};
