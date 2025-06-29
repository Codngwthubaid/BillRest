import type { Invoice } from "@/types/invoice.types";

type Business = {
  businessName: string;
  address?: string;
};

type POSReceipt58mmProps = {
  business: Business;
  invoice: Invoice;
};


export default function POSReceipt58mm({ business, invoice }: POSReceipt58mmProps) {
  return (
    <div
      className="w-[50mm] mx-auto p-2 text-xs font-mono border-t border-dashed border-black mt-2 pt-2"
      style={{ fontSize: "12px" }}
    >
      {/* Business Info */}
      <div className="text-center mb-2">
        <h3 className="text-base font-bold">{business.businessName}</h3>
        <p>{business.address || ""}</p>
      </div>

      {/* Invoice Meta */}
      <div className="mb-1">
        <div>Invoice #: {invoice.invoiceNumber}</div>
        <div>Date: {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "N/A"}</div>
      </div>

      {/* Customer */}
      <div className="mb-2">
        Customer: {invoice.customerName || "N/A"}
      </div>

      {/* Items */}
      <div className="border-t border-dashed border-black pt-1 mb-1">
        {invoice.products.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span>
              {typeof item.product === "string"
                ? item.product
                : item.product?.name || "Unknown"} x{item.quantity}
            </span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Taxes */}
      <div className="mb-1">
        <div>CGST: ₹{invoice.cgstAmount.toFixed(2)}</div>
        <div>SGST: ₹{invoice.sgstAmount.toFixed(2)}</div>
        <div>IGST: ₹{invoice.igstAmount.toFixed(2)}</div>
      </div>

      {/* Total */}
      <div className="font-bold mt-1 mb-2">
        Total: ₹{invoice.totalAmount.toFixed(2)}
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
