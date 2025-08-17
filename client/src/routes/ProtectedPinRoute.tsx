import { useEffect, useState } from "react";
import { useBusinessStore } from "@/store/business.store";
import { useClinicStore } from "@/store/clinic.store";
import { useAuthStore } from "@/store/auth.store";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ProtectedPinRoute = () => {
  const { user } = useAuthStore();

  const {
    business,
    loading: businessLoading,
    error: businessError,
    isPinVerified,
    verifyPin,
    resetPinVerification
  } = useBusinessStore();

  const {
    clinic,
    loading: clinicLoading,
    error: clinicError
  } = useClinicStore();

  const [inputPin, setInputPin] = useState("");
  const [open, setOpen] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCustomer = user?.role === "customer";
  const isClinic = user?.role === "clinic";

  const activeEntity = isCustomer ? business : isClinic ? clinic : null;
  const isLoading = isCustomer ? businessLoading : isClinic ? clinicLoading : false;
  const error = isCustomer ? businessError : isClinic ? clinicError : null;

  useEffect(() => {
    resetPinVerification();
    setInputPin("");
    setOpen(true);
  }, [location.pathname]);

  if (isLoading) return <div className="text-center mt-10">Loading entity data...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  if (!activeEntity) return <div className="text-center mt-10">No entity data found.</div>;

  if (isPinVerified) return <Outlet />;

  const handleVerify = () => {
    if (!activeEntity.protectedPin) {
      toast.error("No PIN configured.");
      return;
    }

    if (inputPin.trim() === activeEntity.protectedPin.trim()) {
      verifyPin();
      setOpen(false);
      toast.success("PIN verified successfully!");
    } else {
      toast.error("Incorrect PIN.");
    }
  };

  const handleCancel = () => {
    setInputPin("");
    setShowPin(false);
    setOpen(false);
    navigate("/");
    toast.info("PIN entry cancelled.");
  };

  return (
    <Dialog open={open}>
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
            onClick={() => setShowPin(prev => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <DialogFooter className="flex justify-between gap-2 pt-4">
          <Button variant="destructive" onClick={handleCancel} className="w-1/2">
            Cancel
          </Button>
          <Button onClick={handleVerify} className="w-1/2 bg-blue-600 text-white hover:bg-blue-700">
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProtectedPinRoute;
