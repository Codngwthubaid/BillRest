import puppeteer from "puppeteer";
import { Invoice } from "../models/invoice.model.js";
import { Business } from "../models/business.model.js";

export const downloadPOSReceiptPDF = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoiceId = req.params.id;
    const size = req.query.size || "80mm";

    const business = await Business.findOne({ user: userId });
    if (!business) return res.status(404).send("Business not found");

    const invoice = await Invoice.findOne({ _id: invoiceId, user: userId });
    if (!invoice) return res.status(404).send("Invoice not found");

    let paperWidth = "80mm";
    if (size === "58mm") paperWidth = "58mm";

    // Build your HTML
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
        <body>
          <div class="center">
            <h3>${business.businessName}</h3>
            <p>${business.address || ""}</p>
             <p>GSTIN: ${business.gstNumber || "N/A"}</p>
          </div>
          <div>Invoice #: ${invoice.invoiceNumber}<br>Date: ${new Date(invoice.createdAt).toLocaleDateString()}</div>
          <div>Customer: ${invoice.customerName || "N/A"}</div>
          <div>Customer GSTIN: ${invoice.gstNumber || "N/A"}</div>
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

    // Generate PDF with puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: paperWidth,
      printBackground: true,
      margin: { top: "5mm", right: "5mm", bottom: "5mm", left: "5mm" }
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${invoice.invoiceNumber}-${size}.pdf`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);

  } catch (err) {
    console.error("POS PDF generation failed:", err);
    res.status(500).send("Failed to generate POS receipt PDF.");
  }
};
