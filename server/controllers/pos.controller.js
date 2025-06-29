import { Invoice } from "../models/invoice.model.js";
import { Business } from "../models/business.model.js";

export const renderPOSReceipt = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoiceId = req.params.id;

    const business = await Business.findOne({ user: userId });
    if (!business) return res.status(404).send("Business not found");

    if (!business.features?.posPrint || business.features.posPrint === "disabled") {
      return res.status(400).send("POS printing is disabled for your account.");
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, user: userId });
    if (!invoice) return res.status(404).send("Invoice not found");

    // Get size from query param or fallback to business default
    const requestedSize = req.query.size;
    let paperWidth;

    if (requestedSize === "58mm") {
      paperWidth = "50mm";
    } else if (requestedSize === "80mm") {
      paperWidth = "80mm";
    } else {
      // fallback to business settings
      paperWidth = business.features.posPrint === "58mm" ? "50mm" : "80mm";
    }

    const html = `
      <html>
        <head>
          <style>
            body { width: ${paperWidth}; font-family: Arial, sans-serif; font-size: 12px; }
            .receipt { border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; }
            .total { font-weight: bold; margin-top: 5px; }
            .center { text-align: center; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="center">
            <h3>${business.businessName}</h3>
            <p>${business.address || ""}</p>
          </div>
          <div>Invoice #: ${invoice.invoiceNumber}<br>Date: ${new Date(invoice.createdAt).toLocaleDateString()}</div>
          <div>Customer: ${invoice.customerName || "N/A"}</div>
          <div class="receipt">
            ${invoice.products.map(item => `
              <div>${item.product} x${item.quantity} @ ₹${item.price} = ₹${(item.price * item.quantity).toFixed(2)}</div>
            `).join("")}
          </div>
          <div>CGST: ₹${invoice.cgstAmount.toFixed(2)}</div>
          <div>SGST: ₹${invoice.sgstAmount.toFixed(2)}</div>
          <div>IGST: ₹${invoice.igstAmount.toFixed(2)}</div>
          <div class="total">Total: ₹${invoice.totalAmount.toFixed(2)}</div>
          <div>Paid via: ${invoice.paymentMethod}</div>
          <div class="center">Thank you for your purchase!</div>
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("POS print failed:", err);
    res.status(500).send("Failed to render POS receipt.");
  }
};
