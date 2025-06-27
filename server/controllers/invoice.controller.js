import { Invoice } from "../models/invoice.model.js";
import { Product } from "../models/product.model.js";
import { sendInvoiceViaWhatsApp } from "../utils/sendWhatsApp.js";
import { generateInvoicePDF } from "../utils/pdfGenerator.js";

// Helper to generate unique invoice numbers
let counter = 1;
const generateInvoiceNumber = () => `INV${String(counter++).padStart(4, "0")}`;

// Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      products, paymentMethod, currency, customerName, phoneNumber, status
    } = req.body;

    let subTotal = 0;
    let gstAmount = 0;

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const productTotal = item.price * item.quantity;
      const gst = (productTotal * item.gstRate) / 100;

      subTotal += productTotal;
      gstAmount += gst;
    }

    const totalAmount = subTotal + gstAmount;

    const invoice = await Invoice.create({
      user: userId,
      invoiceNumber: generateInvoiceNumber(),
      products,
      subTotal,
      gstAmount,
      totalAmount,
      paymentMethod,
      currency,
      customerName,
      phoneNumber,
      status: status || "draft"
    });

    res.status(201).json({ message: "Invoice created", invoice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Invoice
export const updateInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    // If products are being updated, recalculate totals
    if (updateData.products) {
      let subTotal = 0;
      let gstAmount = 0;

      for (const item of updateData.products) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        const productTotal = item.price * item.quantity;
        const gst = (productTotal * item.gstRate) / 100;

        subTotal += productTotal;
        gstAmount += gst;
      }

      updateData.subTotal = subTotal;
      updateData.gstAmount = gstAmount;
      updateData.totalAmount = subTotal + gstAmount;
    }

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, user: userId },
      updateData,
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({
      message: "Invoice updated successfully",
      invoice: updatedInvoice
    });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete Invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const userId = req.user.id;

    const deletedInvoice = await Invoice.findOneAndDelete({ _id: invoiceId, user: userId });

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Invoices for User
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id }).populate("products.product", "name price gstRate").sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user.id }).populate("products.product", "name price gstRate");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Download Invoice as PDF
export const downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate("products.product", "name price gstRate");

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const pdfBuffer = await generateInvoicePDF(invoice);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${invoice.invoiceNumber}.pdf`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send Invoice via WhatsApp
export const sendInvoiceWhatsApp = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId).populate("products.product", "name price gstRate");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const pdfBuffer = await generateInvoicePDF(invoice);
    const pdfUrl = await uploadPDFAndGetLink(pdfBuffer, `invoice-${invoice._id}.pdf`);

    await sendInvoiceViaWhatsApp(invoice.phoneNumber, pdfUrl);

    res.json({ message: "Invoice sent via WhatsApp successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send invoice via WhatsApp ❌" });
  }
};