import { X } from 'lucide-react';
import { Dialog } from '../ui/dialog';
import type { Invoice } from '../../types/customers.types';

interface InvoiceDetailDialogProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export default function InvoiceDetailDialog({
  invoice,
  onClose,
}: InvoiceDetailDialogProps) {
  if (!invoice || !invoice._id) {
    return null;
  }

  return (
    <Dialog open={true}>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-scroll"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Invoice #{invoice.invoiceNumber}</h2>
              <p className="text-sm text-gray-500">Invoice details</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  invoice.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                <span className="text-lg font-semibold text-gray-900">₹{invoice.totalAmount.toLocaleString()}</span>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Products:</h4>
                <div className="space-y-2">
                  {invoice.products.map((product, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{product.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">per unit</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

