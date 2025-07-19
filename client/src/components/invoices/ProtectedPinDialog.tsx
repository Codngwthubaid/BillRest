import { useState } from "react";
import { useBusinessStore } from "@/store/business.store";
import { useClinicStore } from "@/store/clinic.store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth.store"; 

export default function ProtectedPinDialog({
    open,
    onClose,
    onVerified
}: {
    open: boolean;
    onClose: () => void;
    onVerified: () => void;
}) {
    const { user } = useAuthStore();
    const role = user?.role;
    const business = useBusinessStore((state) => state.business);
    const clinic = useClinicStore((state) => state.clinic);
    const protectedPin = role === "clinic" ? clinic?.protectedPin : business?.protectedPin;

    const [inputPin, setInputPin] = useState("");
    const [showPin, setShowPin] = useState(false);

    const handleVerify = () => {
        if (!protectedPin) {
            toast.error("No PIN configured.");
            return;
        }

        if (inputPin.trim() === protectedPin.trim()) {
            toast.success("PIN verified successfully!");
            setInputPin("");
            onClose();
            onVerified();
        } else {
            toast.error("Incorrect PIN");
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-lg">Enter Protected PIN</DialogTitle>
                </DialogHeader>

                <div className="relative">
                    <Input
                        type={showPin ? "text" : "password"}
                        value={inputPin}
                        onChange={(e) => setInputPin(e.target.value)}
                        placeholder="Enter PIN"
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPin((prev) => !prev)}
                        className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <DialogFooter className="flex w-full">
                    <Button
                        variant="destructive"
                        onClick={() => {
                            setInputPin("");
                            onClose();
                        }}
                        className="w-1/2"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleVerify}
                        className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Verify
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
