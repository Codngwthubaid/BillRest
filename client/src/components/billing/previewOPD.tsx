import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/auth.store";
import { useBusinessStore } from "@/store/business.store";
import { useServiceStore } from "@/store/service.store";
import { ToWords } from "to-words";
import { useEffect } from "react";
import type { IPDResponse } from "@/types/ipd.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opd: IPDResponse | null;
  onDownloadPDF?: () => void;
  onPrintPDF?: () => void;
}

export default function PreviewOPDDialog({ open, onOpenChange, opd }: Props) {
  const { user } = useAuthStore();
  const { business } = useBusinessStore();
  const { services, fetchServices } = useServiceStore();
  const toWords = new ToWords();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (!opd) return null;

  const amountInWords = opd.billing?.finalAmount ? toWords.convert(opd.billing.finalAmount) : "";

  // Unified table items with fallback to saved data
  const allItems = [
    ...(opd.treatments || []).map((t) => {
      // Use service object if populated, else find in services by ID, else fallback to saved name/price
      const svc = typeof t.service === "string"
        ? services.find(s => s._id === t.service)
        : t.service;

      return {
        name: svc?.name || t.name || "Unknown Service",
        category: "Treatment",
        quantity: t.quantity || 1,
        price: svc?.price || t.price || 0,
        amount: t.totalCharges || ((t.quantity || 1) * (svc?.price || t.price || 0)),
      };
    }),
    ...(opd.otherCharges || []).map((c) => ({
      name: c.name || "Other Charge",
      category: "Other",
      quantity: c.quantity || 1,
      price: c.amount || 0,
      amount: (c.amount || 0) * (c.quantity || 1),
    })),
  ];

  console.log(opd)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[65vw] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Preview OPD Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="pr-2">
          {/* Header */}
          <div className="flex justify-between border-b pb-3 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-emerald-700">{business?.businessName}</h2>
              <p className="text-xs">Phone: {user?.phone}</p>
              <p className="text-xs">Email: {user?.email}</p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold mb-1">OPD Bill</h3>
              <p>OPD No: {opd.ipdNumber}</p>
              <p>Appointment: {opd.admissionDate ? new Date(opd.admissionDate).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="bg-gray-50 p-3 rounded border mb-4">
            <h4 className="font-semibold mb-1">Patient Details</h4>
            <p><strong>Name:</strong> {opd.patient?.name}</p>
            <p><strong>Phone:</strong> {opd.patient?.phoneNumber}</p>
            <p><strong>Age:</strong> {opd.patient?.age}</p>
            <p><strong>Gender:</strong> {opd.patient?.gender}</p>
          </div>
          
          {/* Services & Other Charges */}
          <h4 className="font-semibold mb-2">Services & Charges</h4>
          <table className="w-full border border-gray-300 text-xs mb-4">
            <thead className="bg-emerald-100">
              <tr>
                <th className="border px-2 py-1 text-left">Item</th>
                <th className="border px-2 py-1 text-left">Category</th>
                <th className="border px-2 py-1 text-center">Qty</th>
                <th className="border px-2 py-1 text-right">Price</th>
                <th className="border px-2 py-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {allItems.length > 0 ? (
                allItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{item.name}</td>
                    <td className="border px-2 py-1">{item.category}</td>
                    <td className="border px-2 py-1 text-center">{item.quantity}</td>
                    <td className="border px-2 py-1 text-right">₹{Number(item.price).toFixed(2)}</td>
                    <td className="border px-2 py-1 text-right">₹{Number(item.amount).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-2">No items found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Billing Summary */}
          <div className="flex justify-between items-start mt-4">
            <div className="text-sm italic">
              Amount in words: <strong>{amountInWords} only</strong>
            </div>
            <div>
              <table className="text-xs text-right border border-gray-300 w-64">
                <tbody>
                  <tr>
                    <td className="pr-2 border px-2 py-1">Service Charges:</td>
                    <td className="border px-2 py-1">₹{opd.billing?.serviceCharges?.toFixed(2) || 0}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 border px-2 py-1">Other Charges:</td>
                    <td className="border px-2 py-1">₹{(opd.otherCharges?.reduce((acc, c) => acc + (c.amount || 0) * (c.quantity || 1), 0)).toFixed(2) || 0}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 border px-2 py-1">Discounts / Grants:</td>
                    <td className="border px-2 py-1">-₹{opd.billing?.grantsOrDiscounts?.toFixed(2) || 0}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 border font-semibold px-2 py-1">Total Amount:</td>
                    <td className="border font-semibold px-2 py-1">₹{opd.billing?.finalAmount?.toFixed(2) || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Note & Payment Status */}
          {opd.note && (
            <div className="mt-4">
              <h4 className="font-semibold mb-1">Note:</h4>
              <div className="border border-dashed border-gray-400 h-20 p-2">{opd.note}</div>
            </div>
          )}
          <div className="mt-2">
            <strong>Payment Status:</strong> {opd.paymentStatus}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
