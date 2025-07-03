import { Edit3, Trash2, User, Phone, MapPin, FileText, IndianRupee  } from 'lucide-react';
import type { Customer } from '../../types/customers.types';

interface CustomerCardProps {
  customer: Customer;
  onViewDetails: () => void;
  onDelete: () => void;
  onCreateInvoice?: () => void;
  onEdit?: () => void;
}

export default function CustomerCard({
  customer,
  onViewDetails,
  onDelete,
  onEdit
}: CustomerCardProps) {

  const totalSales = customer.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const invoiceCount = customer.invoices.length;

  return (
    <div className="rounded-xl p-6 border transition-all flex flex-col justify-between duration-200 dark:bg-[#171717]">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12rounded-lg flex items-center justify-center">
              <User className="size-12 rounded-md p-2 mt-1 text-blue-600 bg-blue-100" />
            </div>
            <div>
              <h3 className="text-lg font-semibold ">{customer.name}</h3>
              <p className="text-sm ">{customer.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 rounded-lg transition-colors"
                title="Edit customer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onDelete}
              className="p-2  hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete customer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-sm ">
            <Phone className="w-4 h-4 " />
            <span>{customer.phoneNumber}</span>
          </div>
          {customer.state && (
            <div className="flex items-center space-x-3 text-sm ">
              <MapPin className="w-4 h-4 " />
              <span>{customer.state}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        {/* Stats */}
        <div className="flex items-center justify-between mb-6 p-4 border rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-lg font-semibold">{invoiceCount}</span>
            </div>
            <p className="text-xs ">Invoices</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
              <IndianRupee  className="w-4 h-4" />
              <span className="text-lg font-semibold">₹{totalSales.toLocaleString()}</span>
            </div>
            <p className="text-xs ">Total Sales</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onViewDetails}
            className="flex-1 px-4 py-2 dark:text-white border rounded-lg transition-colors text-sm font-medium"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
