import PdfPrinter from "pdfmake";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "../fonts/Roboto-Bold.ttf"),
    italics: path.join(__dirname, "../fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "../fonts/Roboto-BoldItalic.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

export const generateIPDPDF = async (ipd, clinic, patient) => {
  // Build treatment table
  const treatmentTableBody = [
    [
      { text: "Service Name", style: "tableHeader" },
      { text: "Date", style: "tableHeader" },
      { text: "Quantity", style: "tableHeader" },
      { text: "Price", style: "tableHeader" },
      { text: "Amount", style: "tableHeader" },
    ],
  ];

  // Build each treatment row
  ipd.treatments.forEach((treatment) => {
    const serviceName = treatment.service?.name || "Unknown";
    const date = new Date(treatment.date).toLocaleDateString();
    const quantity = treatment.quantity || 1;
    const price = (treatment.totalCharges / quantity).toFixed(2);
    const amount = treatment.totalCharges.toFixed(2);

    treatmentTableBody.push([
      serviceName,
      date,
      quantity.toString(),
      `₹${price}`,
      `₹${amount}`,
    ]);
  });

  // Build other charges table
  const otherChargesTableBody = [
    [
      { text: "Item Name", style: "tableHeader" },
      { text: "Amount", style: "tableHeader" },
    ],
  ];

  ipd.billing.otherCharges.forEach((charge) => {
    otherChargesTableBody.push([charge.itemName, `₹${charge.amount.toFixed(2)}`]);
  });

  // Amount in words (simple placeholder, can be enhanced with a number-to-words library)
  const amountWords = `Rupees ${ipd.billing.finalAmount.toFixed(2)} only`;

  const docDefinition = {
    content: [
      // Header
      {
        columns: [
          [
            { text: clinic?.businessName || "YOUR CLINIC NAME", style: "header" },
            { text: `Address: ${clinic?.address || "Your Clinic Address"}`, style: "subheader" },
            { text: `GSTIN: ${clinic?.gstNumber || "N/A"}`, style: "subheader" },
            { text: `Phone: ${clinic?.phone || "+91 9876543210"}`, style: "subheader" },
            { text: `Email: ${clinic?.email || "clinic@example.com"}`, style: "subheader" },
          ],
          {
            alignment: "right",
            stack: [
              { text: "IPD Bill", style: "invoiceTitle" },
              { text: `IPD Number: ${ipd.ipdNumber}` },
              { text: `Admission Date: ${new Date(ipd.admissionDate).toLocaleDateString()}` },
              { text: `Discharge Date: ${ipd.dischargeDate ? new Date(ipd.dischargeDate).toLocaleDateString() : "N/A"}` },
              { text: `Bed Number: ${ipd.bedNumber}` },
            ],
          },
        ],
      },
      "\n",

      // Patient Info
      {
        stack: [
          { text: `Patient: ${patient?.name || "Unknown"}`, style: "customerInfo" },
          { text: `Phone: ${patient?.phoneNumber || "N/A"}` },
          { text: `Age: ${patient?.age || "N/A"}` },
          { text: `Gender: ${patient?.gender || "N/A"}` },
          { text: `Address: ${patient?.address || "N/A"}` },
        ],
      },
      "\n",

      // Treatments Table
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto", "auto"],
          body: treatmentTableBody,
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex === 0 ? "#d3f6ec" : null),
        },
      },
      "\n",

      // Other Charges Table
      ipd.billing.otherCharges.length > 0 && {
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          body: otherChargesTableBody,
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex === 0 ? "#d3f6ec" : null),
        },
      },
      "\n",

      // Billing Summary
      {
        columns: [
          {
            text: `Amount in words: ${amountWords}`,
            italics: true,
            margin: [0, 5, 0, 0],
          },
          {
            alignment: "left",
            table: {
              widths: ["auto", "auto"],
              body: [
                ["Bed Charges:", `₹${ipd.billing.bedCharges.toFixed(2)}`],
                ["Service Charges:", `₹${ipd.billing.serviceCharges.toFixed(2)}`],
                ["Other Charges:", `₹${ipd.billing.otherCharges.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}`],
                ["Subtotal:", `₹${ipd.billing.totalBeforeDiscount.toFixed(2)}`],
                ["Grants/Discounts:", `₹${ipd.billing.grantsOrDiscounts.toFixed(2)}`],
                [{ text: "Final Amount:", bold: true }, { text: `₹${ipd.billing.finalAmount.toFixed(2)}`, bold: true }],
                ["Payment Status:", ipd.paymentStatus],
              ],
            },
            layout: "noBorders",
          },
        ],
      },
      "\n",

      // Custom Note Section
      {
        text: "Custom Note:",
        style: "noteTitle",
        margin: [0, 20, 0, 5],
      },

      // Box for writing notes
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "\n\n\n\n\n\n\n\n\n\n", // ~10 blank lines for manual input
                style: "noteBox",
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#999999",
          vLineColor: () => "#999999",
          paddingTop: () => 5,
          paddingBottom: () => 5,
          paddingLeft: () => 5,
          paddingRight: () => 5,
        },
      },
    ],
    styles: {
      header: { fontSize: 14, bold: true },
      subheader: { fontSize: 9 },
      invoiceTitle: { fontSize: 13, bold: true, color: "#089981", margin: [0, 0, 0, 5] },
      customerInfo: { margin: [0, 0, 0, 10] },
      tableHeader: { fillColor: "#d3f6ec", bold: true, fontSize: 10 },
      noteTitle: { fontSize: 12, bold: true },
      noteBox: { fontSize: 10 },
    },
    defaultStyle: {
      font: "Roboto",
      fontSize: 10,
    },
  };

  // Filter out undefined or null content entries (e.g., other charges table if empty)
  docDefinition.content = docDefinition.content.filter((item) => item);

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  return new Promise((resolve, reject) => {
    const chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    pdfDoc.on("error", (err) => reject(err));
    pdfDoc.end();
  });
};