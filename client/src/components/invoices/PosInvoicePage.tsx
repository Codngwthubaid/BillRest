import { useEffect } from "react";
import type { Invoice } from "@/types/invoice.types";

interface PosInvoicePageProps {
    invoice: Invoice;
    width?: string;
}

export default function PosInvoicePage({ invoice, width = "58mm" }: PosInvoicePageProps) {
    useEffect(() => {
        // Automatically open print on load
        window.print();
    }, []);

    return (
        <div
            className="pos-receipt font-mono"
            style={{
                width: width,
                maxWidth: "100%",
                margin: "0 auto",
                padding: "8px"
            }}
        >
            <h2 className="text-center text-lg font-bold mb-2">Tax Invoice</h2>
            <p className="text-center mb-4">BillRest POS</p>

            <div className="text-sm mb-2">
                <p>Invoice #: {invoice.invoiceNumber}</p>
                <p>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                <p>Customer: {invoice.customerName}</p>
                <p>Phone: {invoice.phoneNumber}</p>
            </div>

            <table className="w-full text-sm mb-2">
                <thead>
                    <tr>
                        <th className="text-left">Item</th>
                        <th className="text-right">Qty</th>
                        <th className="text-right">₹</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.products.map((item, i) => (
                        <tr key={i}>
                            <td>{item.product.name}</td>
                            <td className="text-right">{item.quantity}</td>
                            <td className="text-right">{(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="text-sm mt-2">
                {invoice.cgstAmount > 0 && <p>CGST: ₹{invoice.cgstAmount.toFixed(2)}</p>}
                {invoice.sgstAmount > 0 && <p>SGST: ₹{invoice.sgstAmount.toFixed(2)}</p>}
                {invoice.igstAmount > 0 && <p>IGST: ₹{invoice.igstAmount.toFixed(2)}</p>}
                <p>Total GST: ₹{invoice.gstAmount.toFixed(2)}</p>
                <p>Subtotal: ₹{invoice.subTotal.toFixed(2)}</p>
                <p className="font-bold">Grand Total: ₹{invoice.totalAmount.toFixed(2)}</p>
            </div>

            <div className="text-center mt-4 text-xs">
                <p>Payment: {invoice.paymentMethod}</p>
                <p>Thank you for shopping!</p>
            </div>
        </div>
    );
}
