import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useBusinessStore } from "@/store/business.store";
import { useReportStore } from "@/store/report.store";
import { getBusiness, upsertBusiness } from "@/services/business.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { User, Mail, Phone, Building, MapPin, FileText, DollarSign, Calendar, Edit, Save } from "lucide-react";
import type { BusinessPayload } from "@/types/business.types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";

export default function UserProfileDetails() {
  const { user } = useAuthStore();
  const { setBusiness } = useBusinessStore();
  const { data: reportData } = useReportStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<BusinessPayload>({
    name: user?.name || "",
    phone: user?.phone || "",
    businessName: "",
    address: "",
    defaultCurrency: "INR",
    gstSlabs: [],
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await getBusiness();
        setBusiness(data);
        setFormData({
          name: user?.name || "",
          phone: user?.phone || "",
          businessName: data.businessName,
          address: data.address || "",
          defaultCurrency: data.defaultCurrency,
          gstSlabs: data.gstSlabs,
        });
      } catch (err) {
        console.error("Failed to fetch business", err);
      }
    };
    fetchBusiness();
  }, [setBusiness, user]);

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

  const handleSave = async () => {
    try {
      const res = await upsertBusiness(formData);
      setBusiness(res.business);
      toast.success("Profile updated successfully");
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      <Card className="rounded-lg shadow-sm ">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center">
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
                <Button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
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
                      className="w-full px-3 py-2  -gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:-green-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium  mb-2">Phone Number</Label>
                    <Input
                      placeholder="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2  -gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:-green-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium  mb-2">Business Name</Label>
                    <Input
                      placeholder="Business Name"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full px-3 py-2  -gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:-green-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium  mb-2">Address</Label>
                    <Input
                      placeholder="Address"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2  -gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:-green-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium  mb-2">Default Currency</Label>
                    <select
                      name="defaultCurrency"
                      value={formData.defaultCurrency}
                      onChange={handleChange}
                      className="w-full px-3 py-2  -gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:-green-500"
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
                        className="w-full px-3 py-2  -gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:-green-500"
                      />
                      <Input
                        placeholder="GST Value (%)"
                        type="number"
                        value={slab.value}
                        onChange={(e) => handleGstSlabChange(index, +e.target.value)}
                        className="w-full px-3 py-2  -gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:-green-500"
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
                  <Button onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-lg shadow-sm  -gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold ">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {reportData?.invoices?.slice(0, 5).map((invoice) => (
              <div key={invoice._id} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600`}>
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
    </div>
  );
}
