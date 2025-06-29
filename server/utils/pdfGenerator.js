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

export const generateInvoicePDF = async (invoice) => {
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
  const amountWords = `FOURTEEN THOUSAND THREE HUNDRED FORTY THREE`;

  const docDefinition = {
    content: [
      // Header with company & invoice meta
      {
        columns: [
          [
            { text: "YOUR BUSINESS NAME", style: "businessName" },
            { text: "Address: Your Business Address Line", style: "small" },
            { text: "GST: YOURGST1234XYZ", style: "small" },
            { text: "Phone: +91 9876543210", style: "small" },
            { text: "Email: business@example.com", style: "small" },
          ],
          [
            {
              stack: [
                { text: "Proforma Invoice", style: "invoiceTitle" },
                { text: `Invoice: ${invoice.invoiceNumber}` },
                { text: `Date: ${new Date(invoice.createdAt).toLocaleDateString()}` },
                { text: `Due Date: ${new Date(invoice.createdAt).toLocaleDateString()}` }
              ],
              alignment: "right"
            }
          ]
        ]
      },
      "\n",
      // Customer Info
      {
        text: `${invoice.customerName}\n${invoice.phoneNumber}`,
        margin: [0, 0, 0, 10]
      },
      // Table
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto", "auto", "auto", "auto"],
          body: productTableBody
        },
        layout: {
          fillColor: (rowIndex) => rowIndex === 0 ? '#d3f6ec' : null
        }
      },
      "\n",
      // Totals & amount in words
      {
        columns: [
          [
            { text: `Amount in words: ${amountWords}`, italics: true }
          ],
          {
            width: "auto",
            table: {
              body: [
                ["Subtotal:", `₹${invoice.subTotal.toFixed(2)}`],
                ["Total Tax:", `₹${invoice.gstAmount.toFixed(2)}`],
                ["Total Amount:", `₹${invoice.totalAmount.toFixed(2)}`],
                ["Amount Received:", `₹0.00`],
                ["Balance Due:", `₹${invoice.totalAmount.toFixed(2)}`]
              ]
            },
            layout: "noBorders"
          }
        ]
      },
      "\n",
      // Bank details
      {
        table: {
          widths: ["*"],
          body: [
            [{ text: "Bank/Account Details", style: "subheader" }],
            ["Bank Name: Axis Bank"],
            ["Account Number: 9230020048749817"],
            ["IFSC: UTIB0002972"],
            ["Account Name: Noddy Panda"]
          ]
        }
      },
      "\n",
      // Terms
      {
        text: `Terms & Conditions\nOur responsibility ceases as soon as goods leave our premises.\nProducts once sold will not be returned/exchanged.\nDelivery charges must be paid by customer.`,
        style: "terms"
      }
    ],
    styles: {
      businessName: { fontSize: 14, bold: true },
      small: { fontSize: 9 },
      invoiceTitle: {
        fontSize: 13,
        bold: true,
        color: '#089981',
        margin: [0,0,0,5]
      },
      tableHeader: {
        fillColor: '#d3f6ec',
        bold: true,
        fontSize: 10
      },
      subheader: {
        fontSize: 11,
        bold: true
      },
      terms: {
        fontSize: 8,
        margin: [0,5,0,0]
      }
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
