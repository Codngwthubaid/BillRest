
import { X } from 'lucide-react';
import { Dialog } from '../ui/dialog';
import type { Customer, Invoice } from '../../types/customers.types';

interface CustomerDetailsDialogProps {
  customer: Customer | null;
  onClose: () => void;
  onSelectInvoice: (invoice: Invoice) => void;
}

export default function CustomerDetailsDialog({
  customer,
  onClose,
  onSelectInvoice
}: CustomerDetailsDialogProps) {
  if (!customer || !customer._id) {
    return null;
  }

  return (
    <Dialog open={!!(customer && customer._id)}>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{customer.name}</h2>
              <p className="text-sm text-gray-500">Customer invoices</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {customer.invoices && customer.invoices.length > 0 ? (
              <div className="space-y-3">
                {customer.invoices.map((invoice) => (
                  <div
                    key={invoice._id}
                    onClick={() => onSelectInvoice(invoice)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">#{invoice.invoiceNumber}</h4>
                        <p className="text-sm text-gray-500">Status: {invoice.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{invoice.totalAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{invoice.products.length} items</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No invoices found for this customer.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}