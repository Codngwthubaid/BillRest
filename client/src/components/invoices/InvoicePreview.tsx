import { useAuthStore } from "@/store/auth.store";
import { useBusinessStore } from "@/store/business.store";
import type { Invoice } from "@/types/invoice.types";
import { ToWords } from 'to-words';

type InvoicePreviewProps = {
  invoice: Invoice;
};

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const toWords = new ToWords();
  const amountInWords = toWords.convert(invoice.totalAmount);
  const { user } = useAuthStore();
  const { business } = useBusinessStore();

  return (
    <div className="mx-auto bg-white rounded-lg text-sm font-sans">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">{business?.businessName}</h2>
          <p className="text-xs">Address: {business?.address}</p>
          <p className="text-xs">Phone: {user?.phone}</p>
          <p className="text-xs">Email: {user?.email}</p>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-bold text-emerald-600 mb-1">BillRest Invoice</h3>
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
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Discount (%)</th>
              <th className="border px-2 py-1">SGST</th>
              <th className="border px-2 py-1">CGST</th>
              <th className="border px-2 py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((item, idx) => {
              const gstRate = Number(item.gstRate);
              const quantity = Number(item.quantity);
              const price = Number(item.price);
              const discountPercent = Number(item.discount ?? 0);

              // Correct discount calculation
              const discountAmountPerItem = price * (discountPercent / 100);
              const discountedPrice = price - discountAmountPerItem;
              const amount = (quantity * discountedPrice).toFixed(2);

              const sgst = (gstRate / 2).toFixed(1);
              const cgst = (gstRate / 2).toFixed(1);

              return (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.name}</td>
                  <td className="border px-2 py-1 text-center">{quantity}</td>
                  <td className="border px-2 py-1 text-right">₹{price.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-right">{discountPercent}%</td>
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
            Amount in words: {amountInWords} only
          </p>
        </div>
        <div>
          <table className="text-xs text-right">
            <tbody>
              <tr>
                <td className="pr-2">Subtotal:</td>
                <td>₹{invoice.subTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="pr-2">Total Tax:</td>
                <td>₹{invoice.gstAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="pr-2 font-semibold">Total Amount:</td>
                <td className="font-semibold">₹{invoice.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
