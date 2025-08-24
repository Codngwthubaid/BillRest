import { useAuthStore } from "@/store/auth.store";
import { useBusinessStore } from "@/store/business.store";
import type { IPDResponse } from "@/types/ipd.types";
import { ToWords } from 'to-words';

type IPDPreviewProps = {
  IPD: IPDResponse;
};

export default function IPDPreview({ IPD }: IPDPreviewProps) {
  if (!IPD) return null;
  const toWords = new ToWords();
  const amountInWords = toWords.convert(IPD.billing.finalAmount);
  const { user } = useAuthStore();
  const { business } = useBusinessStore();

  console.log("Rendering IPDPreview with IPD:", IPD);

  return (
    <div className="mx-auto bg-white rounded-lg text-sm font-sans">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">{business?.businessName}</h2>
          <p className="text-xs">Phone: {user?.phone}</p>
          <p className="text-xs">Email: {user?.email}</p>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-bold text-emerald-600 mb-1">IPD IPD</h3>
          <p>IPD Number: {IPD.ipdNumber}</p>
          <div>Admission Date: {IPD.admissionDate ? new Date(IPD.admissionDate).toLocaleDateString() : "N/A"}</div>
          <div>Created At: {IPD.createdAt ? new Date(IPD.createdAt).toLocaleDateString() : "N/A"}</div>
        </div>
      </div>

      {/* Patient Info */}
      <div className="mb-4">
        <p className="whitespace-pre-line">
          Name : {IPD.patient?.name}
          {"\n"}
          Phone : {IPD.patient?.phoneNumber}
          {"\n"}
          Age: {IPD?.patient?.age || "N/A"}
          {"\n"}
          Gender: {IPD.patient?.gender || "N/A"}
          {"\n"}
          Address: {IPD.patient?.address || "N/A"}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-xs">
          <thead className="bg-emerald-100">
            <tr>
              <th className="border px-2 py-1">Service Name</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {IPD.treatments.map((item, idx) => {
              const quantity = Number(item.quantity);
              const price = Number(item.service.price);
              const amount = (quantity * price).toFixed(2);

              return (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.service.name}</td>
                  <td className="border px-2 py-1">{item.service.category || "N/A"}</td>
                  <td className="border px-2 py-1 text-center">{quantity}</td>
                  <td className="border px-2 py-1 text-right">₹{price.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-right">₹{amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Other Charges Table */}
      {IPD.billing?.otherCharges?.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full border border-gray-300 text-xs">
            <thead className="bg-emerald-100">
              <tr>
                <th className="border px-2 py-1">Other Charge</th>
                <th className="border px-2 py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {IPD.billing?.otherCharges?.map((charge, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{charge.itemName}</td>
                  <td className="border px-2 py-1 text-right">₹{charge.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                <td className="pr-2">Service Charges:</td>
                <td>₹{IPD.billing.serviceCharges.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="pr-2">Bed Charges:</td>
                <td>₹{IPD.billing.bedCharges.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="pr-2">Grants/Discounts:</td>
                <td>-₹{IPD.billing.grantsOrDiscounts.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="pr-2 font-semibold">Total Amount:</td>
                <td className="font-semibold">₹{IPD.billing.finalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Note */}
      <div className="mt-6">
        <p className="text-sm font-semibold mb-2">Note:</p>
        <div className="border border-dashed border-gray-400 h-20 p-2">{IPD.note || "N/A"}</div>
      </div>
    </div>
  );
}