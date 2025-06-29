import type { Invoice } from "@/types/invoice.types";

type InvoicePreviewProps = {
  invoice: Invoice;
};

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  return (
    <div className="mx-auto bg-white rounded-lg text-sm font-sans">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">YOUR BUSINESS NAME</h2>
          <p className="text-xs">Address: Your Business Address Line</p>
          <p className="text-xs">GST: YOURGST1234XYZ</p>
          <p className="text-xs">Phone: +91 9876543210</p>
          <p className="text-xs">Email: business@example.com</p>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-bold text-emerald-600 mb-1">Proforma Invoice</h3>
          <p>Invoice: {invoice.invoiceNumber}</p>
          <div>Date: {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "N/A"}</div>
          <div>Due Date: {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "N/A"}</div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-4">
        <p className="whitespace-pre-line">
          {invoice.customerName}
          {"\n"}
          {invoice.phoneNumber}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-xs">
          <thead className="bg-emerald-100">
            <tr>
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">HSN</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">SGST</th>
              <th className="border px-2 py-1">CGST</th>
              <th className="border px-2 py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((item, idx) => {
              const sgst = (item.gstRate / 2).toFixed(1);
              const cgst = (item.gstRate / 2).toFixed(1);
              const amount = (item.quantity * item.price).toFixed(2);
              return (
                <tr key={idx}>
                  <td className="border px-2 py-1">
                    {typeof item.product === "string"
                      ? item.product
                      : item.product?.name || "Unknown"}
                  </td>
                  <td className="border px-2 py-1">6109</td>
                  <td className="border px-2 py-1 text-center">{item.quantity}</td>
                  <td className="border px-2 py-1 text-right">₹{item.price.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-right">{sgst}%</td>
                  <td className="border px-2 py-1 text-right">{cgst}%</td>
                  <td className="border px-2 py-1 text-right">₹{amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Amount in words & Totals */}
      <div className="flex justify-between mt-4">
        <div>
          <p className="italic">
            Amount in words: FOURTEEN THOUSAND THREE HUNDRED FORTY THREE
          </p>
        </div>
        <div>
          <table className="text-xs text-right">
            <tbody>
              <tr><td className="pr-2">Subtotal:</td><td>₹{invoice.subTotal.toFixed(2)}</td></tr>
              <tr><td className="pr-2">Total Tax:</td><td>₹{invoice.gstAmount.toFixed(2)}</td></tr>
              <tr><td className="pr-2 font-semibold">Total Amount:</td><td className="font-semibold">₹{invoice.totalAmount.toFixed(2)}</td></tr>
              <tr><td className="pr-2">Amount Received:</td><td>₹0.00</td></tr>
              <tr><td className="pr-2">Balance Due:</td><td>₹{invoice.totalAmount.toFixed(2)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-4 text-[10px] leading-tight">
        <p className="font-semibold mb-1">Terms & Conditions</p>
        <p>
          Our responsibility ceases as soon as goods leave our premises.<br />
          Products once sold will not be returned/exchanged.<br />
          Delivery charges must be paid by customer.
        </p>
      </div>
    </div>
  );
}
