import { useAuthStore } from "@/store/auth.store";
import { useBusinessStore } from "@/store/business.store";
import type { IPDResponse } from "@/types/ipd.types";
import { ToWords } from "to-words";

type IPDPreviewProps = {
  IPD: IPDResponse;
};

export default function IPDPreview({ IPD }: IPDPreviewProps) {
  if (!IPD) return null;

  const toWords = new ToWords();
  const amountInWords = IPD.billing?.finalAmount
    ? toWords.convert(IPD.billing.finalAmount)
    : "";

  const { user } = useAuthStore();
  const { business } = useBusinessStore();

  // Prepare unified data for the table
  const allItems = [
    ...(IPD.bed?.treatments || []).map((t) => ({
      name: t.name,
      category: "Treatment",
      quantity: 1,
      price: t.price,
      amount: t.price,
    })),
    ...(IPD.bed?.medicines || []).map((m) => ({
      name: m.name,
      category: "Medicine",
      quantity: 1,
      price: m.price,
      amount: m.price,
    })),
    ...(IPD.bed?.services || []).map((s) => ({
      name: s.name,
      category: "Service",
      quantity: s.quantity || 1,
      price: s.price,
      amount: s.quantity * s.price,
    })),
    ...(IPD.billing?.otherCharges || []).map((c) => ({
      name: c.itemName,
      category: "Other",
      quantity: 1,
      price: c.amount,
      amount: c.amount,
    })),
  ];

  return (
    <div className="mx-auto bg-white rounded-lg text-sm font-sans p-6 border border-gray-300 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between border-b pb-3 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-700">{business?.businessName}</h2>
          <p className="text-xs">Phone: {user?.phone}</p>
          <p className="text-xs">Email: {user?.email}</p>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-bold mb-1">Hospital Bill</h3>
          <p>IPD No: {IPD.ipdNumber}</p>
          <p>Admission: {IPD.admissionDate ? new Date(IPD.admissionDate).toLocaleDateString() : "N/A"}</p>
          <p>Discharge: {IPD.dischargeDate ? new Date(IPD.dischargeDate).toLocaleDateString() : "N/A"}</p>
        </div>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded border">
          <h4 className="font-semibold mb-1">Patient Details</h4>
          <p><strong>Name:</strong> {IPD.patient?.name}</p>
          <p><strong>Phone:</strong> {IPD.patient?.phoneNumber}</p>
          <p><strong>Age:</strong> {IPD.patient?.age}</p>
          <p><strong>Gender:</strong> {IPD.patient?.gender}</p>
        </div>
        {IPD.bed && (
          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="font-semibold mb-1">Bed Details</h4>
            <p><strong>Room:</strong> {IPD.bed.roomNumber}</p>
            <p><strong>Bed No:</strong> {IPD.bed.bedNumber}</p>
          </div>
        )}
      </div>

      {/* Unified Table */}
      <h4 className="font-semibold mb-2">Services & Treatments</h4>
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
                <td className="border px-2 py-1">₹{IPD.billing?.serviceCharges?.toFixed(2) || 0}</td>
              </tr>
              <tr>
                <td className="pr-2 border px-2 py-1">Bed Charges:</td>
                <td className="border px-2 py-1">₹{IPD.billing?.bedCharges?.toFixed(2) || 0}</td>
              </tr>
              <tr>
                <td className="pr-2 border px-2 py-1">Discounts:</td>
                <td className="border px-2 py-1">-₹{IPD.billing?.grantsOrDiscounts?.toFixed(2) || 0}</td>
              </tr>
              <tr>
                <td className="pr-2 border font-semibold px-2 py-1">Total Amount:</td>
                <td className="border font-semibold px-2 py-1">₹{IPD.billing?.finalAmount?.toFixed(2) || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      {IPD.note && (
        <div className="mt-4">
          <h4 className="font-semibold mb-1">Note:</h4>
          <div className="border border-dashed border-gray-400 h-20 p-2">{IPD.note}</div>
        </div>
      )}
    </div>
  );
}

