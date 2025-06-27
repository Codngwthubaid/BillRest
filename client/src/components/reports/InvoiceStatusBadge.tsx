import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface InvoiceStatusBadgeProps {
  status: string;
}

export const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return {
          variant: 'default' as const,
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200'
        };
      case 'pending':
        return {
          variant: 'secondary' as const,
          icon: Clock,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200'
        };
      case 'overdue':
        return {
          variant: 'destructive' as const,
          icon: AlertCircle,
          className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200'
        };
      case 'cancelled':
        return {
          variant: 'outline' as const,
          icon: XCircle,
          className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200'
        };
      default:
        return {
          variant: 'outline' as const,
          icon: Clock,
          className: ''
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`capitalize flex items-center gap-1 ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
};