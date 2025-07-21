import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useClinicStore } from "@/store/clinic.store";
import { useSubscriptionStore } from "@/store/subscription.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { User, Mail, Phone, Building, MapPin, Calendar, Edit, Save, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import ProtectedPinDialog from "../invoices/ProtectedPinDialog";

export default function UserProfileDetailsForHealth() {
  const { user } = useAuthStore();
  const { clinic, loading, error, fetchClinic, saveClinicProfile } = useClinicStore();
  const { currentSubscription, fetchUserSubscription } = useSubscriptionStore();

  const [open, setOpen] = useState(false);
  const [localPin, setLocalPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [protectedPinDialogOpen, setProtectedPinDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    businessName: "",
    address: "",
    protectedPin: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEyeClick = () => {
    if (showPin) {
      setShowPin(false);
    } else {
      setProtectedPinDialogOpen(true);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.protectedPin && localPin) {
        formData.protectedPin = localPin;
      }
      await saveClinicProfile(formData);
      await fetchClinic();
      toast.success("Clinic profile updated successfully");
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    fetchClinic();
    fetchUserSubscription();
  }, [fetchClinic, fetchUserSubscription]);

  useEffect(() => {
    if (clinic) {
      setFormData({
        name: user?.name || "",
        phone: user?.phone || "",
        businessName: clinic.businessName,
        address: clinic.address || "",
        protectedPin: clinic.protectedPin || "",
      });
    }
  }, [clinic, user]);

  if (loading) return <div>Loading clinic profile...</div>;
  if (error) return <div>Error loading clinic: {error}</div>;

  return (
    <div className="lg:col-span-2 space-y-6">
      <Card className="rounded-lg shadow-sm ">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0) || "?"}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold ">{user?.name || "User"}</h2>
              <p>{user?.email || "N/A"}</p>
              <p className="text-sm capitalize">{user?.role?.replace("_", " ") || "N/A"}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Calendar className="w-4 h-4 " />
                <span className="text-sm ">Joined {format(new Date(), "yyyy-MM-dd")}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium mb-2">Full Name</Label>
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 " />
                <span>{formData.name || "N/A"}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2">Email Address</Label>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 " />
                <span>{user?.email || "N/A"}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2">Phone Number</Label>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 " />
                <span>{formData.phone || "N/A"}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2">Clinic Name</Label>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 " />
                <span>{formData.businessName || "N/A"}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2">Clinic ID</Label>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 " />
                <span>{clinic?.clinicId || "N/A"}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium mb-2">Address</Label>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1" />
                <span>{formData.address || "N/A"}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2">Protected PIN</Label>
              <div className="flex items-center space-x-3">
                <span>
                  {formData.protectedPin
                    ? showPin ? formData.protectedPin : "******"
                    : "N/A"}
                </span>
                {formData.protectedPin && (
                  <button type="button" onClick={handleEyeClick}>
                    {showPin
                      ? <EyeOff className="w-4 h-4 text-muted-foreground" />
                      : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Clinic Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} />
                  <Input placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                  <Input placeholder="Clinic Name" name="businessName" value={formData.businessName} onChange={handleChange} />
                  <Input placeholder="Address" name="address" value={formData.address} onChange={handleChange} />
                  {!formData.protectedPin ? (
                    <div>
                      <Label className="text-sm font-medium mb-2">Set Protected PIN</Label>
                      <Input
                        type={showPin ? "text" : "password"}
                        placeholder="Enter 4-6 digit PIN"
                        name="protectedPin"
                        value={localPin}
                        onChange={(e) => setLocalPin(e.target.value)}
                        maxLength={6}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This PIN is used for extra verification and cannot be changed later.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Protected PIN is already set and cannot be changed.</p>
                  )}
                </div>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className="pt-6 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Subscription Details</CardTitle>
        </CardHeader>
        <CardContent className="pb-6 space-y-4">
          {currentSubscription ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan</span>
                <span className="text-sm text-muted-foreground">{currentSubscription.plan?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className={`text-sm ${currentSubscription.status === "active" ? "text-green-600" : "text-red-600"}`}>
                  {currentSubscription.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Start Date</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(currentSubscription.startDate), "dd MMM yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">End Date</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(currentSubscription.endDate), "dd MMM yyyy")}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No active subscription found.</p>
          )}
        </CardContent>
      </Card>

      <ProtectedPinDialog
        open={protectedPinDialogOpen}
        onClose={() => setProtectedPinDialogOpen(false)}
        onVerified={() => setShowPin(true)}
      />
    </div>
  );
}
