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

export const generateInvoicePDF = async (invoice, business, user) => {
  // Build table header
  const productTableBody = [
    [
      { text: "Product Name", style: "tableHeader" },
      { text: "HSN", style: "tableHeader" },
      { text: "Qty", style: "tableHeader" },
      { text: "Price", style: "tableHeader" },
      { text: "SGST", style: "tableHeader" },
      { text: "CGST", style: "tableHeader" },
      { text: "Amount", style: "tableHeader" }
    ]
  ];

  // Build each row
  invoice.products.forEach(item => {
    const sgst = (item.gstRate / 2).toFixed(1);
    const cgst = (item.gstRate / 2).toFixed(1);
    const amount = (item.quantity * item.price).toFixed(2);
    productTableBody.push([
      item.productName || "Unknown",
      "6109", // HSN - static or from your product model if you have
      item.quantity.toString(),
      `₹${item.price.toFixed(2)}`,
      `${sgst}%`,
      `${cgst}%`,
      `₹${amount}`
    ]);
  });

  // Amount in words (simple example)
  const amountWords = invoice.totalAmount;

  const docDefinition = {
    content: [
      // Header
      {
        columns: [
          [
            { text: business?.businessName || "YOUR BUSINESS NAME", style: "header" },
            { text: `Address: ${business?.address || "Your Business Address"}`, style: "subheader" },
            { text: `Phone: ${user?.phone || "+91 9876543210"}`, style: "subheader" },
            { text: `Email: ${user?.email || "business@example.com"}`, style: "subheader" }
          ],
          {
            alignment: "right",
            stack: [
              { text: "BillRest Invoice", style: "invoiceTitle" },
              { text: `Invoice: ${invoice.invoiceNumber}` },
              { text: `Date: ${new Date(invoice.createdAt).toLocaleDateString()}` },
              { text: `Due Date: ${new Date(invoice.createdAt).toLocaleDateString()}` }
            ]
          }
        ]
      },
      "\n",

      // Customer info
      {
        text: `${invoice.customerName}\n${invoice.phoneNumber}`,
        style: "customerInfo"
      },
      "\n",

      // Products Table
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto", "auto", "auto"],
          body: [
            [
              { text: "Product Name", style: "tableHeader" },
              { text: "Qty", style: "tableHeader" },
              { text: "Price", style: "tableHeader" },
              { text: "SGST", style: "tableHeader" },
              { text: "CGST", style: "tableHeader" },
              { text: "Amount", style: "tableHeader" }
            ],
            ...invoice.products.map(item => {
              const quantity = Number(item.quantity);
              const price = Number(item.price);
              const sgst = (item.gstRate / 2).toFixed(1);
              const cgst = (item.gstRate / 2).toFixed(1);
              const amount = (quantity * price).toFixed(2);

              return [
                item.name,
                `${quantity}`,
                `₹${price.toFixed(2)}`,
                `${sgst}%`,
                `${cgst}%`,
                `₹${amount}`
              ];
            })
          ]
        },
        layout: {
          fillColor: (rowIndex) => rowIndex === 0 ? '#d3f6ec' : null
        }
      },

      "\n",

      // Totals and amount in words
      {
        columns: [
          {
            text: `Amount in words: ${amountWords} only`,
            italics: true,
            margin: [0, 5, 0, 0]
          },
          {
            alignment: "right",
            table: {
              widths: ["auto", "auto"],
              body: [
                ["Subtotal:", `₹${invoice.subTotal.toFixed(2)}`],
                ["Total Tax:", `₹${invoice.gstAmount.toFixed(2)}`],
                [{ text: "Total Amount:", bold: true }, { text: `₹${invoice.totalAmount.toFixed(2)}`, bold: true }]
              ]
            },
            layout: "noBorders"
          }
        ]
      }
    ],
    styles: {
      header: { fontSize: 14, bold: true },
      subheader: { fontSize: 9 },
      invoiceTitle: { fontSize: 13, bold: true, color: '#089981', margin: [0, 0, 0, 5] },
      customerInfo: { margin: [0, 0, 0, 10] },
      tableHeader: { fillColor: '#d3f6ec', bold: true, fontSize: 10 }
    },
    defaultStyle: {
      font: "Roboto",
      fontSize: 10
    }
  };


  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  return new Promise((resolve, reject) => {
    const chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    pdfDoc.end();
  });
};
