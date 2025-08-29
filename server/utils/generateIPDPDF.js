// import PdfPrinter from "pdfmake";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const fonts = {
//   Roboto: {
//     normal: path.join(__dirname, "../fonts/Roboto-Regular.ttf"),
//     bold: path.join(__dirname, "../fonts/Roboto-Bold.ttf"),
//     italics: path.join(__dirname, "../fonts/Roboto-Italic.ttf"),
//     bolditalics: path.join(__dirname, "../fonts/Roboto-BoldItalic.ttf"),
//   },
// };

// const printer = new PdfPrinter(fonts);

// export const generateIPDPDF = async (ipd, clinic, patient) => {
//   // ✅ Treatment table
//   const treatmentTableBody = [
//     [
//       { text: "Service Name", style: "tableHeader" },
//       { text: "Date", style: "tableHeader" },
//       { text: "Quantity", style: "tableHeader" },
//       { text: "Price", style: "tableHeader" },
//       { text: "Amount", style: "tableHeader" },
//     ],
//   ];

//   (ipd.treatments || []).forEach((treatment) => {
//     const serviceName = treatment.service?.name || "Unknown";
//     const date = treatment.date ? new Date(treatment.date).toLocaleDateString() : "-";
//     const quantity = treatment.quantity || 1;
//     const price = (treatment.totalCharges / quantity).toFixed(2);
//     const amount = treatment.totalCharges.toFixed(2);

//     treatmentTableBody.push([
//       serviceName,
//       date,
//       quantity.toString(),
//       `₹${price}`,
//       `₹${amount}`,
//     ]);
//   });

//   // ✅ Other charges table
//   const otherChargesTableBody = [
//     [
//       { text: "Item Name", style: "tableHeader" },
//       { text: "Amount", style: "tableHeader" },
//     ],
//   ];
//   (ipd.billing?.otherCharges || []).forEach((charge) => {
//     otherChargesTableBody.push([charge.itemName, `₹${charge.amount.toFixed(2)}`]);
//   });

//   const amountWords = `Rupees ${ipd.billing.finalAmount.toFixed(2)} only`;

//   const docDefinition = {
//     content: [
//       {
//         columns: [
//           [
//             { text: clinic?.businessName || "YOUR CLINIC NAME", style: "header" },
//             { text: `Address: ${clinic?.address || "Your Clinic Address"}`, style: "subheader" },
//             { text: `Phone: ${clinic?.phone || "+91 9876543210"}`, style: "subheader" },
//             { text: `Email: ${clinic?.email || "clinic@example.com"}`, style: "subheader" },
//           ],
//           {
//             alignment: "right",
//             stack: [
//               { text: `${clinic?.businessName || "Clinic"} Bill`, style: "invoiceTitle" },
//               { text: `IPD Number: ${ipd.ipdNumber}` },
//               { text: `Admission Date: ${new Date(ipd.admissionDate).toLocaleDateString()}` },
//               { text: `Discharge Date: ${ipd.dischargeDate ? new Date(ipd.dischargeDate).toLocaleDateString() : "N/A"}` },
//               { text: `Bed Number: ${ipd.bed?.bedNumber || "N/A"}` },
//             ],
//           },
//         ],
//       },
//       "\n",
//       {
//         stack: [
//           { text: `Patient: ${patient?.name || "Unknown"}`, style: "customerInfo" },
//           { text: `Phone: ${patient?.phoneNumber || "N/A"}` },
//           { text: `Age: ${patient?.age || "N/A"}` },
//           { text: `Gender: ${patient?.gender || "N/A"}` },
//           { text: `Address: ${patient?.address || "N/A"}` },
//         ],
//       },
//       "\n",
//       {
//         table: {
//           headerRows: 1,
//           widths: ["*", "auto", "auto", "auto", "auto"],
//           body: treatmentTableBody,
//         },
//         layout: {
//           fillColor: (rowIndex) => (rowIndex === 0 ? "#d3f6ec" : null),
//         },
//       },
//       "\n",
//       ipd.billing?.otherCharges?.length > 0 && {
//         table: {
//           headerRows: 1,
//           widths: ["*", "auto"],
//           body: otherChargesTableBody,
//         },
//         layout: {
//           fillColor: (rowIndex) => (rowIndex === 0 ? "#d3f6ec" : null),
//         },
//       },
//       "\n",
//       {
//         columns: [
//           {
//             text: `Amount in words: ${amountWords}`,
//             italics: true,
//             margin: [0, 5, 0, 0],
//           },
//           {
//             alignment: "left",
//             table: {
//               widths: ["auto", "auto"],
//               body: [
//                 ["Service Charges:", `₹${ipd.billing.serviceCharges.toFixed(2)}`],
//                 ["Bed Charges:", `₹${ipd.billing.bedCharges.toFixed(2)}`],
//                 ["Subtotal:", `₹${ipd.billing.totalBeforeDiscount.toFixed(2)}`],
//                 ["Grants/Discounts:", `₹${ipd.billing.grantsOrDiscounts.toFixed(2)}`],
//                 [{ text: "Final Amount:", bold: true }, { text: `₹${ipd.billing.finalAmount.toFixed(2)}`, bold: true }],
//                 ["Payment Status:", ipd.paymentStatus || "Pending"],
//               ],
//             },
//             layout: "noBorders",
//           },
//         ],
//       },
//       "\n",
//       { text: "Note:", style: "noteTitle", margin: [0, 20, 0, 5] },
//       {
//         table: {
//           widths: ["*"],
//           body: [[{ text: ipd.note || "N/A", style: "noteBox" }]],
//         },
//         layout: {
//           hLineWidth: () => 0.5,
//           vLineWidth: () => 0.5,
//           hLineColor: () => "#999999",
//           vLineColor: () => "#999999",
//         },
//       },
//     ].filter(Boolean),
//     styles: {
//       header: { fontSize: 14, bold: true },
//       subheader: { fontSize: 9 },
//       invoiceTitle: { fontSize: 13, bold: true, color: "#089981", margin: [0, 0, 0, 5] },
//       customerInfo: { margin: [0, 0, 0, 10] },
//       tableHeader: { fillColor: "#d3f6ec", bold: true, fontSize: 10 },
//       noteTitle: { fontSize: 12, bold: true },
//       noteBox: { fontSize: 10 },
//     },
//     defaultStyle: { font: "Roboto", fontSize: 10 },
//   };

//   const pdfDoc = printer.createPdfKitDocument(docDefinition);
//   return new Promise((resolve, reject) => {
//     const chunks = [];
//     pdfDoc.on("data", (chunk) => chunks.push(chunk));
//     pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
//     pdfDoc.on("error", (err) => reject(err));
//     pdfDoc.end();
//   });
// };






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
  const bed = ipd.bed || {};
  const billing = ipd.billing || {};

  const bedCharges = billing.bedCharges ?? 0;
  const serviceCharges = billing.serviceCharges ?? 0;
  const treatmentCharges = billing.treatmentCharges ?? 0;
  const medicineCharges = billing.medicineCharges ?? 0;
  const grantsOrDiscounts = billing.grantsOrDiscounts ?? 0;
  const finalAmount = billing.finalAmount ?? 0;

  // Combine all items: Treatments, Services, Medicines
  const allItems = [
    // Treatments from IPD
    ...(ipd.treatments || []).map((t) => ({
      name: t.service?.name || t.name || "Treatment",
      category: "Treatment",
      quantity: t.quantity || 1,
      price: t.service?.price ?? t.price ?? 0,
      amount: (t.service?.price ?? t.price ?? 0) * (t.quantity || 1),
    })),
    // Treatments from Bed (if any)
    ...(bed.treatments || []).map((t) => ({
      name: t.service?.name || t.name || "Treatment",
      category: "Treatment",
      quantity: t.quantity || 1,
      price: t.service?.price ?? t.price ?? 0,
      amount: (t.service?.price ?? t.price ?? 0) * (t.quantity || 1),
    })),
    // Services from Bed
    ...(bed.services || []).map((s) => ({
      name: s.service?.name || s.name || "Service",
      category: "Service",
      quantity: s.quantity || 1,
      price: s.price ?? 0,
      amount: (s.price ?? 0) * (s.quantity || 1),
    })),
    // Medicines from Bed
    ...(bed.medicines || []).map((m) => ({
      name: m.name || "Medicine",
      category: "Medicine",
      quantity: m.quantity || 1,
      price: m.price ?? 0,
      amount: (m.price ?? 0) * (m.quantity || 1),
    })),
  ];

  // Table body
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
      // Header
      {
        columns: [
          [
            { text: clinic?.name || "Hospital Name", style: "header" },
            { text: `Phone: ${clinic?.phone || clinic?.phoneNumber || "N/A"}`, style: "subheader" },
            { text: `Email: ${clinic?.email || clinic?.emailAddress || "N/A"}`, style: "subheader" },
          ],
          {
            alignment: "right",
            stack: [
              { text: "Hospital Bill", style: "invoiceTitle" },
              { text: `IPD No: ${ipd.ipdNumber || "N/A"}` },
              { text: `Admission: ${ipd.admissionDate ? new Date(ipd.admissionDate).toLocaleDateString() : "N/A"}` },
              { text: `Discharge: ${ipd.dischargeDate ? new Date(ipd.dischargeDate).toLocaleDateString() : "N/A"}` },
            ],
          },
        ],
      },
      "\n",
      // Patient & Bed details
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
              { text: "Bed Details", bold: true },
              { text: `Room: ${bed.room || bed.roomNumber || "N/A"}` },
              { text: `Bed No: ${bed.bedNumber || "N/A"}` },
            ],
            width: "50%",
          },
        ],
      },
      "\n",
      // Items Table
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
      // Billing summary
      {
        columns: [
          { text: `Amount in words: ${amountInWords}`, italics: true },
          {
            alignment: "right",
            table: {
              widths: ["auto", "auto"],
              body: [
                ["Bed Charges:", `₹${bedCharges.toFixed(2)}`],
                ["Service Charges:", `₹${serviceCharges.toFixed(2)}`],
                ["Treatment Charges:", `₹${treatmentCharges.toFixed(2)}`],
                ["Medicine Charges:", `₹${medicineCharges.toFixed(2)}`],
                ["Discounts:", `-₹${grantsOrDiscounts.toFixed(2)}`],
                [{ text: "Total Amount:", bold: true }, { text: `₹${finalAmount.toFixed(2)}`, bold: true }],
              ],
            },
            layout: "noBorders",
          },
        ],
      },
      "\n",
      // Note
      { text: "Note:", bold: true },
      { text: ipd.note || "N/A", margin: [0, 5, 0, 0] },
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
