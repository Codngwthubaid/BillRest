import type { Invoice } from "@/types/invoice.types";

type Business = {
  businessName: string;
  address?: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
};

type POSReceipt58mmProps = {
  business: Business;
  invoice: Invoice;
};

import { ToWords } from 'to-words';

export default function POSReceipt58mm({ business, invoice }: POSReceipt58mmProps) {
  const toWords = new ToWords();
  const amountInWords = invoice ? toWords.convert(invoice.totalAmount) : "";

  return (
    <div
      className="w-[50mm] mx-auto p-2 text-xs font-mono border-t border-dashed border-black mt-2 pt-2"
      style={{ fontSize: "12px" }}
    >
      {/* Business Info */}
      <div className="text-center mb-2">
        <h3 className="text-base font-bold">{business.businessName}</h3>
        {business.address && <p>{business.address}</p>}
        {business.phone && <p>Ph: {business.phone}</p>}
        {business.email && <p>{business.email}</p>}
        <p>GSTIN: {business.gstNumber || "N/A"}</p>
      </div>

      {/* Invoice Meta */}
      <div className="mb-1">
        <div>Invoice #: {invoice.invoiceNumber}</div>
        <div>Date: {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "N/A"}</div>
      </div>

      {/* Customer */}
      <div className="mb-1">
        Customer: {invoice.customerName || "N/A"}
        {invoice.phoneNumber && <div>Ph: {invoice.phoneNumber}</div>}
        <div>GSTIN: {invoice.gstNumber || "N/A"}</div>
      </div>

      {/* Items */}
      <div className="border-t border-dashed border-black pt-1 mb-1">
        {invoice.products.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span>{item.name} x{item.quantity}</span>
            <span>₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Taxes */}
      <div className="mb-1">
        <div>CGST: ₹{invoice.cgstAmount.toFixed(2)}</div>
        <div>SGST: ₹{invoice.sgstAmount.toFixed(2)}</div>
        <div>IGST: ₹{invoice.igstAmount.toFixed(2)}</div>
      </div>

      {/* Totals */}
      <div className="border-t border-dashed border-black mt-1 pt-1 mb-1">
        <div>Subtotal: ₹{invoice.subTotal.toFixed(2)}</div>
        <div>Total Tax: ₹{invoice.gstAmount.toFixed(2)}</div>
        <div className="font-bold">Total: ₹{invoice.totalAmount.toFixed(2)}</div>
      </div>

      {/* Amount in words */}
      <div className="italic mb-1">
        {amountInWords} only
      </div>

      {/* Payment */}
      <div className="mb-1">
        Paid via: {invoice.paymentMethod}
      </div>

      {/* Thank You */}
      <div className="text-center mt-2">
        Thank you for your purchase!
      </div>
    </div>
  );
}
