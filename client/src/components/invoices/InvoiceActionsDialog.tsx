import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPrintA4: () => void;
    onPrint58mm: () => void;
    onPrint80mm: () => void;
}

export default function InvoiceActionsDialog({
    open,
    onOpenChange,
    onPrintA4,
    onPrint58mm,
    onPrint80mm,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invoice Created Successfully</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-6">
                    <Button onClick={onPrintA4} className="bg-blue-600 hover:bg-blue-700">
                        Print A4
                    </Button>
                    <Button onClick={onPrint58mm} className="bg-purple-600 hover:bg-purple-700">
                        Print 58mm
                    </Button>
                    <Button onClick={onPrint80mm} className="bg-orange-600 hover:bg-orange-700">
                        Print 80mm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
