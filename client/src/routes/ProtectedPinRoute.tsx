import { useState, useEffect } from "react";
import { useBusinessStore } from "@/store/business.store";
import { Outlet, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProtectedPinRoute = () => {
  const {
    business,
    loading,
    error,
    isPinVerified,
    verifyPin,
    resetPinVerification
  } = useBusinessStore();

  const [inputPin, setInputPin] = useState("");
  const [open, setOpen] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate()
  useEffect(() => {
    resetPinVerification();
    setInputPin("");
    setOpen(true);
  }, [location.pathname]);

  if (loading) return <div>Loading business data...</div>;
  if (error) return <div>Error loading business: {error}</div>;
  if (!business) return <div>No business data found.</div>;

  const handleVerify = () => {
    if (!business.protectedPin) {
      toast.error("No PIN configured for this business.");
      return;
    }

    if (inputPin.trim() === business.protectedPin.trim()) {
      verifyPin();
      setOpen(false);
      toast.success("PIN verified successfully!");
    } else {
      toast.error("Incorrect PIN");
    }
  };

  const handleCancel = () => {
    setInputPin("");
    setShowPin(false);
    setOpen(false);
    navigate("/dashboard")
    toast.info("PIN entry cancelled.");
  };

  if (isPinVerified) return <Outlet />;

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
            onClick={() => setShowPin((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <DialogFooter className="flex justify-between gap-2">
          <Button 
            variant="destructive" 
            className="w-1/2" 
            onClick={handleCancel}
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
};

export default ProtectedPinRoute;
