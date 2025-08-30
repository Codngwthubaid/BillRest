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

export const generatePDFOPD = async (opd, clinic, patient) => {
  const billing = opd.billing || {};

  const serviceCharges = billing.serviceCharges ?? 0;
  const grantsOrDiscounts = billing.grantsOrDiscounts ?? 0;
  const finalAmount = billing.finalAmount ?? 0;

  // ✅ Add Consultation Charge (fixed ₹0)
  const consultationCharge = 0;

  // Combine all items: Consultation + Treatments + Other Charges
  const allItems = [
    {
      name: "Consultation Charge",
      category: "Consultation",
      quantity: 1,
      price: consultationCharge,
      amount: consultationCharge,
    },
    ...(opd.treatments || []).map((t) => ({
      name: t.service?.name || "Service",
      category: "Treatment",
      quantity: t.quantity || 1,
      price: t.service?.price ?? 0,
      amount: (t.service?.price ?? 0) * (t.quantity || 1),
    })),
    ...(opd.otherCharges || []).map((oc) => ({
      name: oc.name || "Other",
      category: "Other Charges",
      quantity: oc.quantity || 1,
      price: oc.amount ?? 0,
      amount: (oc.amount ?? 0) * (oc.quantity || 1),
    })),
  ];

  const tableBody = [
    [
      { text: "Item", style: "tableHeader" },
      { text: "Category", style: "tableHeader" },
      { text: "Qty", style: "tableHeader", alignment: "center" },
      { text: "Price", style: "tableHeader", alignment: "right" },
      { text: "Amount", style: "tableHeader", alignment: "right" },
    ],
    ...allItems.map((item) => [
      item.name,
      item.category,
      { text: item.quantity.toString(), alignment: "center" },
      { text: `₹${item.price.toFixed(2)}`, alignment: "right" },
      { text: `₹${item.amount.toFixed(2)}`, alignment: "right" },
    ]),
  ];

  const amountInWords = `Rupees ${finalAmount.toFixed(2)} only`;

  const docDefinition = {
    content: [
      {
        columns: [
          [
            { text: clinic?.name || "Clinic Name", style: "header" },
            { text: `Phone: ${clinic?.phone || "N/A"}`, style: "subheader" },
            { text: `Email: ${clinic?.email || "N/A"}`, style: "subheader" },
          ],
          {
            alignment: "right",
            stack: [
              { text: "OPD Bill", style: "invoiceTitle" },
              { text: `OPD No: ${opd.opdNumber || "N/A"}` },
              { text: `Consultation: ${opd.consultationDate ? new Date(opd.consultationDate).toLocaleDateString() : "N/A"}` },
            ],
          },
        ],
      },
      "\n",
      {
        columns: [
          {
            stack: [
              { text: "Patient Details", bold: true },
              { text: `Name: ${patient.name || "N/A"}` },
              { text: `Phone: ${patient.phoneNumber || "N/A"}` },
              { text: `Age: ${patient.age ?? "N/A"}` },
              { text: `Gender: ${patient.gender || "N/A"}` },
            ],
            width: "50%",
          },
          {
            stack: [
              { text: "Consultation Note", bold: true },
              { text: opd.note && opd.note.trim() !== "" ? opd.note : "No notes provided", italics: true }
            ],
            width: "50%",
          },
        ],
      },
      "\n",
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "auto", "auto", "auto"],
          body: tableBody,
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex === 0 ? "#d3f6ec" : null),
        },
      },
      "\n",
      {
        columns: [
          { text: `Amount in words: ${amountInWords}`, italics: true },
          {
            alignment: "right",
            table: {
              widths: ["auto", "auto"],
              body: [
                ["Consultation Charges:", `₹${consultationCharge.toFixed(2)}`],
                ["Service Charges:", `₹${serviceCharges.toFixed(2)}`],
                ["Discounts:", `-₹${grantsOrDiscounts.toFixed(2)}`],
                [{ text: "Total Amount:", bold: true }, { text: `₹${finalAmount.toFixed(2)}`, bold: true }],
              ],
            },
            layout: "noBorders",
          },
        ],
      },
    ],
    styles: {
      header: { fontSize: 14, bold: true },
      subheader: { fontSize: 10 },
      invoiceTitle: { fontSize: 13, bold: true, color: "#089981" },
      tableHeader: { bold: true, fillColor: "#d3f6ec" },
    },
    defaultStyle: { font: "Roboto", fontSize: 10 },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  return new Promise((resolve, reject) => {
    const chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
    pdfDoc.on("error", (err) => reject(err));
    pdfDoc.end();
  });
};

