import React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface POSPrintButtonProps {
  invoiceId: string;
}

export const POSPrintButton: React.FC<POSPrintButtonProps> = ({ invoiceId }) => {
  const handlePrint = () => {
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/invoices/${invoiceId}/pos`;
    window.open(url, "_blank", "width=500,height=700");
  };

  return (
    <Button onClick={handlePrint} className="flex items-center gap-2">
      <Printer size={16} />
      Print POS
    </Button>
  );
};
