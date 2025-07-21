import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Invoice } from "../models/invoice.model.js";
import { Business } from "../models/business.model.js";
import { Customer } from "../models/customer.model.js";
import { Patient } from "../models/patient.model.js";
import { Service } from "../models/service.model.js";
import { Appointment } from "../models/appointment.model.js";
import { IPD } from "../models/ipd.model.js";
import { Clinic } from "../models/clinic.model.js";
import { SupportTicketForGeneral } from "../models/supportTicketForGeneral.model.js";
import { SupportTicketForHealth } from "../models/supportTicketForHealth.model.js"

export const getDashboardStats = async (req, res) => {
  try {
    const totalBusinesses = await Business.countDocuments();
    const activeBusinesses = await Business.countDocuments({ isActive: true });

    const totalInvoices = await Invoice.countDocuments();
    const totalSalesData = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalSales = totalSalesData[0]?.totalSales || 0;

    // Top 5 businesses by total billing
    const topBusinesses = await Invoice.aggregate([
      {
        $group: {
          _id: "$user",
          invoiceCount: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          userId: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          totalSales: 1,
          invoiceCount: 1,
        },
      },
    ]);

    res.json({
      totalBusinesses,
      activeBusinesses,
      totalInvoices,
      totalSales,
      topBusinesses,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err.message);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ businesses });
  } catch (err) {
    console.error("Error fetching businesses:", err.message);
    res.status(500).json({ message: "Failed to fetch businesses" });
  }
};

export const toggleBusinessActive = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user || user.role !== "customer") {
      return res.status(404).json({ message: "Customer not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `Customer ${user.isActive ? "activated" : "deactivated"}`,
      isActive: user.isActive,
    });
  } catch (err) {
    console.error("Toggle active error:", err.message);
    res.status(500).json({ message: "Failed to toggle status" });
  }
};

export const updateBusinessFeatures = async (req, res) => {
  try {
    const { id } = req.params;
    const { features } = req.body;

    const user = await User.findById(id);

    if (!user || user.role !== "customer") {
      return res.status(404).json({ message: "Customer not found" });
    }

    user.features = {
      ...user.features,
      ...features, // merge new updates
    };

    await user.save();

    res.json({
      message: "Features updated successfully",
      features: user.features,
    });
  } catch (err) {
    console.error("Update features failed:", err.message);
    res.status(500).json({ message: "Error updating features" });
  }
};

export const updateClinicFeatures = async (req, res) => {
  try {
    const { id } = req.params;
    const { features } = req.body;

    console.log("Received features to update:", features);

    const user = await User.findById(id);

    if (!user || user.role !== "clinic") {
      return res.status(404).json({ message: "Clinic not found" });
    }

    console.log("Before update - existing features:", user.features);

    user.features = {
      ...user.features,
      ...features,
    };

    await user.save();

    console.log("After update - saved features:", user.features);

    res.json({
      message: "Clinic features updated successfully",
      features: user.features,
    });
  } catch (err) {
    console.error("Update clinic features failed:", err.message);
    res.status(500).json({ message: "Error updating clinic features" });
  }
};

// not used
export const updateCustomerFeatures = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { features } = req.body;

    const customer = await User.findById(customerId);

    if (!customer || customer.role !== "customer") {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.features = {
      ...customer.features,
      ...features,
    };

    await customer.save();

    res.json({
      message: "Customer features updated",
      features: customer.features,
    });
  } catch (err) {
    console.error("Failed to update customer features:", err.message);
    res.status(500).json({ message: "Failed to update features" });
  }
};

export const getAllSupportTicketsForGeneral = async (req, res) => {
  try {
    const tickets = await SupportTicketForGeneral.find()
      .populate("user") // Get limited user info
      .sort({ createdAt: -1 }); // Show newest tickets first
    res.json({ tickets });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ message: "Failed to fetch support tickets" });
  }
};

export const updateTicketStatusForGeneral = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status input
  const validStatuses = ["pending", "resolved", "escalated"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const ticket = await SupportTicketForGeneral.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket status updated", ticket });
  } catch (err) {
    console.error("Failed to update ticket:", err.message);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};
export const getAllSupportTicketsForHealth = async (req, res) => {
  try {
    const tickets = await SupportTicketForHealth.find()
      .populate("user") // Get limited user info
      .sort({ createdAt: -1 }); // Show newest tickets first
    res.json({ tickets });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ message: "Failed to fetch support tickets" });
  }
};

export const updateTicketStatusForHealth = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status input
  const validStatuses = ["pending", "resolved", "escalated"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const ticket = await SupportTicketForHealth.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket status updated", ticket });
  } catch (err) {
    console.error("Failed to update ticket:", err.message);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ count: invoices.length, invoices });
  } catch (err) {
    console.error("Error fetching all invoices:", err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ count: products.length, products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getGlobalSalesReport = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const totalInvoices = invoices.length;
    const totalSalesAmount = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

    // Top 5 businesses by total billing
    const topBusinesses = await Invoice.aggregate([
      {
        $group: {
          _id: "$user",
          totalBilling: { $sum: "$totalAmount" },
          invoiceCount: { $sum: 1 },
        },
      },
      { $sort: { totalBilling: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: 0,
          userId: "$userInfo._id",
          name: "$userInfo.name",
          email: "$userInfo.email",
          totalBilling: 1,
          invoiceCount: 1,
        },
      },
    ]);

    res.json({
      totalInvoices,
      totalSalesAmount,
      topBusinesses,
    });
  } catch (err) {
    console.error("Error fetching global sales report:", err);
    res.status(500).json({ message: "Failed to fetch sales report" });
  }
};

export const getBusinessOverview = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;

    // 1. Fetch Business Owner Info
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const business = await Business.findOne({ user: id });

    // 2. Get Products
    const products = await Product.find({ user: id });

    // 3. Get Invoices
    const invoices = await Invoice.find({ user: id });

    // 4. Filter for Custom Report Range if given
    const filterInvoices = (rangeStart, rangeEnd) =>
      invoices.filter(
        (inv) =>
          new Date(inv.createdAt) >= new Date(rangeStart) &&
          new Date(inv.createdAt) <= new Date(rangeEnd)
      );

    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    const lastQuarter = new Date(today);
    lastQuarter.setMonth(today.getMonth() - 3);
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);

    const financialYearStart = new Date(
      now.getMonth() >= 3 ? `${now.getFullYear()}-04-01` : `${now.getFullYear() - 1}-04-01`
    );
    const financialYearEnd = new Date(financialYearStart);
    financialYearEnd.setFullYear(financialYearEnd.getFullYear() + 1);

    // 5. Build Reports
    const report = {
      daily: filterInvoices(today, new Date()),
      weekly: filterInvoices(lastWeek, new Date()),
      monthly: filterInvoices(lastMonth, new Date()),
      quarterly: filterInvoices(lastQuarter, new Date()),
      yearly: filterInvoices(lastYear, new Date()),
      financialYear: filterInvoices(financialYearStart, financialYearEnd),
      custom: from && to ? filterInvoices(from, to) : [],
    };

    res.json({
      user,
      business,
      products,
      invoices,
      reportSummary: {
        daily: report.daily.length,
        weekly: report.weekly.length,
        monthly: report.monthly.length,
        quarterly: report.quarterly.length,
        yearly: report.yearly.length,
        financialYear: report.financialYear.length,
        ...(from && to && { custom: report.custom.length }),
      },
      fullReport: report,
    });
  } catch (err) {
    console.error("Error in business overview:", err);
    res.status(500).json({ message: "Failed to fetch business overview" });
  }
};

export const getAllCutomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate("invoices")
      .populate("user")
      .lean();
    res.json(customers);
  } catch (err) {
    console.error("Get all customers error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("clinic")
      .populate("visits")
      .sort({ createdAt: -1 });
    res.json({ count: patients.length, patients });
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("clinic")
      .sort({ createdAt: -1 });
    res.json({ count: services.length, services });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("clinic")
      .populate("patient")
      .sort({ createdAt: -1 });
    res.json({ count: appointments.length, appointments });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

export const getAllIPDs = async (req, res) => {
  try {
    const ipds = await IPD.find()
      .populate("clinic")
      .populate("patient")
      .populate("appointment")
      .sort({ createdAt: -1 });
    res.json({ count: ipds.length, ipds });
  } catch (err) {
    console.error("Error fetching IPDs:", err);
    res.status(500).json({ message: "Failed to fetch IPDs" });
  }
};

export const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find()
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ count: clinics.length, clinics });
  } catch (err) {
    console.error("Error fetching clinics:", err);
    res.status(500).json({ message: "Failed to fetch clinics" });
  }
}
