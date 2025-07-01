import { Invoice } from "../models/invoice.model.js";
import { Product } from "../models/product.model.js";
import { Counter } from "../models/counter.js";

const getNextInvoiceNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: "invoiceNumber" },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  return `INV${String(counter.sequence_value).padStart(4, "0")}`;
};

// Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      products,
      paymentMethod,
      currency,
      customerName,
      phoneNumber,
      status,
      customerState,
      businessState,
    } = req.body;

    let subTotal = 0;
    let gstAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    const invoiceProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const discountPercent = item.discount || 0;
      const price = item.price;
      const quantity = item.quantity;

      const productBase = price * quantity;
      const discountAmount = (price * discountPercent / 100) * quantity;
      const productTotal = productBase - discountAmount;
      const gst = (productTotal * item.gstRate) / 100;

      // Add to invoice array
      invoiceProducts.push({
        name: product.name,
        quantity,
        price,
        gstRate: item.gstRate,
        discount: discountPercent
      });

      subTotal += productTotal;
      gstAmount += gst;
    }

    // Calculate CGST, SGST, IGST
    if (customerState && businessState) {
      if (customerState === businessState) {
        cgstAmount = gstAmount / 2;
        sgstAmount = gstAmount / 2;
      } else {
        igstAmount = gstAmount;
      }
    }

    const totalAmount = subTotal + gstAmount;

    const invoice = await Invoice.create({
      user: userId,
      invoiceNumber: await getNextInvoiceNumber(),
      products: invoiceProducts,
      subTotal,
      gstAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalAmount,
      paymentMethod,
      currency,
      customerName,
      phoneNumber,
      status: status || "draft",
      customerState,
      businessState
    });

    res.status(201).json({
      message: "Invoice created successfully",
      invoice
    });

  } catch (err) {
    console.error("Create invoice error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update Invoice
export const updateInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    // Find existing invoice to fallback on missing fields
    const existingInvoice = await Invoice.findOne({ _id: invoiceId, user: userId });
    if (!existingInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    let subTotal = 0;
    let gstAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    let invoiceProducts = [];

    if (updateData.products) {
      for (const item of updateData.products) {
        const productDoc = await Product.findById(item.product);
        if (!productDoc) {
          return res.status(404).json({ message: "Product not found" });
        }

        const discountPercent = item.discount || 0;
        const price = item.price;
        const quantity = item.quantity;

        const productBase = price * quantity;
        const discountAmount = (price * discountPercent / 100) * quantity;
        const productTotal = productBase - discountAmount;
        const gst = (productTotal * item.gstRate) / 100;

        invoiceProducts.push({
          name: productDoc.name,
          quantity,
          price,
          gstRate: item.gstRate,
          discount: discountPercent
        });

        subTotal += productTotal;
        gstAmount += gst;
      }

      // Replace products list
      updateData.products = invoiceProducts;
      updateData.subTotal = subTotal;
      updateData.gstAmount = gstAmount;
    }

    // Make sure customerState & businessState are set (either from body or existing)
    const customerState = updateData.customerState ?? existingInvoice.customerState;
    const businessState = updateData.businessState ?? existingInvoice.businessState;

    // Compute CGST, SGST, IGST
    if (customerState && businessState) {
      if (customerState === businessState) {
        cgstAmount = gstAmount / 2;
        sgstAmount = gstAmount / 2;
      } else {
        igstAmount = gstAmount;
      }
    }

    updateData.cgstAmount = cgstAmount;
    updateData.sgstAmount = sgstAmount;
    updateData.igstAmount = igstAmount;
    updateData.totalAmount = subTotal + gstAmount;

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, user: userId },
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Invoice updated successfully",
      invoice: updatedInvoice
    });

  } catch (err) {
    console.error("Update invoice error:", err);
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
    const invoices = await Invoice.find({ user: req.user.id })
      .populate("products")
      .sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user.id }).populate("products", "name price gstRate");
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
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Manually look up product names
    const enrichedProducts = await Promise.all(invoice.products.map(async (item) => {
      let productName = "Unknown";
      try {
        const productDoc = await Product.findById(item.product).select("name");
        if (productDoc) {
          productName = productDoc.name;
        }
      } catch (err) {
        console.log(`Error fetching product ${item.product}:`, err.message);
      }
      return {
        ...item.toObject(),
        productName
      };
    }));

    // Attach to invoice
    invoice.products = enrichedProducts;

    // Generate the PDF
    const business = await Business.findOne({ user: req.user.id });
    // const user = await User.findOne({ user: req.user.id })
    const pdfBuffer = await generateInvoicePDF(invoice, business);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${invoice.invoiceNumber}.pdf`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Download PDF error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Print invoice as PDF
export const printInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Enrich products
    const enrichedProducts = await Promise.all(invoice.products.map(async (item) => {
      let productName = "Unknown";
      try {
        const productDoc = await Product.findById(item.product).select("name");
        if (productDoc) {
          productName = productDoc.name;
        }
      } catch (err) {
        console.log(`Error fetching product ${item.product}:`, err.message);
      }
      return {
        ...item.toObject(),
        productName
      };
    }));

    invoice.products = enrichedProducts;

    const business = await Business.findOne({ user: req.user.id });
    const pdfBuffer = await generateInvoicePDF(invoice, business);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${invoice.invoiceNumber}.pdf`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Print PDF error:", err);
    res.status(500).json({ message: "Internal Server Error" });
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

export const printInvoicePage = async (req, res) => {
  const pdfUrl = `/invoices/${req.params.id}/print`; // your current print endpoint
  res.send(`
    <html>
      <head>
        <title>Print Invoice</title>
        <style>html, body { margin: 0; height: 100%; }</style>
      </head>
      <body>
        <embed src="${pdfUrl}" type="application/pdf" width="100%" height="100%"></embed>
        <script>
          window.onload = function() {
            setTimeout(() => window.print(), 500);
          }
        </script>
      </body>
    </html>
  `);
};
