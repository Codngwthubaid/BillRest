import PdfPrinter from "pdfmake";
import path from "path";
import { fileURLToPath } from "url";

// Setup font paths for pdfmake
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
  const productTableBody = [
    ["Product", "Qty", "Price", "GST%", "Total"]
  ];

  invoice.products.forEach((item) => {
    const total = item.quantity * item.price;
    productTableBody.push([
      item.product.name,
      item.quantity.toString(),
      `₹${item.price}`,
      `${item.gstRate}%`,
      `₹${total}`
    ]);
  });

  const docDefinition = {
    content: [
      { text: "Invoice", style: "header" },
      { text: `Invoice #: ${invoice.invoiceNumber}` },
      { text: `Date: ${new Date(invoice.createdAt).toLocaleDateString()}` },
      { text: `Customer: ${invoice.customerName || "N/A"}` },
      { text: `Phone: ${invoice.phoneNumber || "N/A"}` },
      "\n",
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto", "auto"],
          body: productTableBody
        }
      },
      "\n",
      {
        alignment: "right",
        columns: [
          { width: "*", text: "" },
          {
            width: "auto",
            table: {
              body: [
                ["Subtotal", `₹${invoice.subTotal.toFixed(2)}`],
                ["GST", `₹${invoice.gstAmount.toFixed(2)}`],
                ["Total", `₹${invoice.totalAmount.toFixed(2)}`]
              ]
            },
            layout: "noBorders"
          }
        ]
      }
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 10]
      }
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  return new Promise((resolve, reject) => {
    const chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });
    pdfDoc.end();
  });
};
