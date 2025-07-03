import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useBusinessStore } from "@/store/business.store";
import { useReportStore } from "@/store/report.store";
import { upsertBusiness } from "@/services/business.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { User, Mail, Phone, Building, MapPin, FileText, DollarSign, Calendar, Edit, Save, Eye, EyeOff } from "lucide-react";
import type { BusinessPayload } from "@/types/business.types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import ProtectedPinDialog from "../invoices/ProtectedPinDialog";
import { useSubscriptionStore } from "@/store/subscription.store";

export default function UserProfileDetails() {
  const { user } = useAuthStore();
  const { business, loading, error, fetchBusiness } = useBusinessStore();
  const { currentSubscription, fetchUserSubscription } = useSubscriptionStore();
  const { data: reportData } = useReportStore();

  const [open, setOpen] = useState(false);
  const [localPin, setLocalPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [protectedPinDialogOpen, setProtectedPinDialogOpen] = useState(false);

  console.log(currentSubscription)

  const [formData, setFormData] = useState<BusinessPayload & { protectedPin?: string }>({
    name: user?.name || "",
    phone: user?.phone || "",
    businessName: "",
    address: "",
    defaultCurrency: "INR",
    gstSlabs: [],
    protectedPin: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGstSlabChange = (index: number, value: number) => {
    setFormData((prev) => {
      const updated = [...prev.gstSlabs];
      updated[index].value = value;
      return { ...prev, gstSlabs: updated };
    });
  };

  const handleAddGstSlab = () => {
    setFormData((prev) => ({
      ...prev,
      gstSlabs: [...prev.gstSlabs, { label: "", value: 0 }],
    }));
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

      await upsertBusiness(formData);
      await fetchBusiness();  // 🔥 replace setBusiness
      toast.success("Profile updated successfully");
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    if (business) {
      setFormData({
        name: user?.name || "",
        phone: user?.phone || "",
        businessName: business.businessName,
        address: business.address || "",
        defaultCurrency: business.defaultCurrency,
        gstSlabs: business.gstSlabs,
        protectedPin: business.protectedPin || "",
      });
    }
  }, [business, user]);

  useEffect(() => {
    fetchUserSubscription();
  }, [fetchUserSubscription]);

  // Loading or error states
  if (loading) return <div>Loading business profile...</div>;
  if (error) return <div>Error loading business: {error}</div>;
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
              <Label className="text-sm font-medium  mb-2">Full Name</Label>
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 " />
                <span className="">{formData.name || "N/A"}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium  mb-2">Email Address</Label>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 " />
                <span className="">{user?.email || "N/A"}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium  mb-2">Phone Number</Label>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 " />
                <span className="">{formData.phone || "N/A"}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium  mb-2">Business Name</Label>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 " />
                <span className="">{formData.businessName || "N/A"}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium  mb-2">Address</Label>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4  mt-1" />
                <span className="">{formData.address || "N/A"}</span>
              </div>
            </div>
            {/* <div>
              <Label className="text-sm font-medium mb-2">Protected PIN</Label>
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4" />
                <span>
                  {formData.protectedPin
                    ? showPin
                      ? formData.protectedPin
                      : "******"
                    : "N/A"}
                </span>
                {formData.protectedPin && (
                  <button
                    type="button"
                    className="ml-2 focus:outline-none"
                    onClick={() => setShowPin((prev) => !prev)}
                  >
                    {showPin ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>
            </div> */}

            <div>
              <Label className="text-sm font-medium mb-2">Protected PIN</Label>
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4" />
                <span>
                  {formData.protectedPin
                    ? showPin
                      ? formData.protectedPin
                      : "******"
                    : "N/A"}
                </span>
                {formData.protectedPin && (
                  <button
                    type="button"
                    className="ml-2 focus:outline-none"
                    onClick={() => handleEyeClick()}
                  >
                    {showPin ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium  mb-2">Default Currency</Label>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-4 h-4 " />
                <span className="">{formData.defaultCurrency || "N/A"}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium  mb-2">GST Slabs</Label>
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 " />
                <span className="">
                  {formData.gstSlabs.length > 0 ? formData.gstSlabs.map(slab => `${slab.label} (${slab.value}%)`).join(", ") : "N/A"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium  mb-2">Full Name</Label>
                    <Input
                      placeholder="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium  mb-2">Phone Number</Label>
                    <Input
                      placeholder="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium  mb-2">Business Name</Label>
                    <Input
                      placeholder="Business Name"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium  mb-2">Address</Label>
                    <Input
                      placeholder="Address"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:-blue-500"
                    />
                  </div>
                  {!formData.protectedPin ? (
                    <div>
                      <Label className="text-sm font-medium mb-2">Set Protected PIN</Label>
                      <div className="relative">
                        <Input
                          type={showPin ? "text" : "password"}
                          placeholder="Enter 4 to 6 digit PIN"
                          name="protectedPin"
                          value={localPin}
                          onChange={(e) => setLocalPin(e.target.value)}
                          maxLength={6}
                          className="w-full px-3 py-2 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 px-3 flex items-center justify-center"
                          onClick={() => setShowPin((prev) => !prev)}
                        >
                          {showPin ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        This PIN is used for extra verification and cannot be changed later.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Protected PIN is already set and cannot be changed.
                    </p>
                  )}

                  <div>
                    <Label className="text-sm font-medium  mb-2">Default Currency</Label>
                    <select
                      name="defaultCurrency"
                      value={formData.defaultCurrency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:-blue-500"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="AED">AED</option>
                    </select>
                  </div>
                  {formData.gstSlabs.map((slab, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="GST Label"
                        value={slab.label}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.gstSlabs];
                            updated[index].label = value;
                            return { ...prev, gstSlabs: updated };
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:-blue-500"
                      />
                      <Input
                        placeholder="GST Value (%)"
                        type="number"
                        value={slab.value}
                        onChange={(e) => handleGstSlabChange(index, +e.target.value)}
                        className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:-blue-500"
                      />
                    </div>
                  ))}
                  <Button onClick={handleAddGstSlab} type="button" variant="outline" className="w-full">
                    + Add GST Slab
                  </Button>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      <Card className="pt-6 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold ">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="space-y-4">
            {reportData?.invoices?.slice(0, 5).map((invoice) => (
              <div key={invoice._id} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium ">
                    Created invoice {invoice.invoiceNumber}
                  </p>
                  <p className="text-sm ">
                    {format(new Date(invoice.createdAt), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
              </div>
            ))}
            {!reportData?.invoices?.length && (
              <p className="text-sm ">No recent activity found.</p>
            )}
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
                <span
                  className={`text-sm ${currentSubscription.status === "active" ? "text-green-600" : "text-red-600"
                    }`}
                >
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
