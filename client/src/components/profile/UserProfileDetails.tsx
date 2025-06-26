import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useBusinessStore } from "@/store/business.store";
import { getBusiness, upsertBusiness } from "@/services/business.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { BusinessPayload } from "@/types/business.types";

export default function UserProfileDetails() {
    const { user } = useAuthStore();
    const { setBusiness } = useBusinessStore();
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
        <Card className="w-[90vw] md:w-auto">
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-start gap-x-10 items-center">
                    <div>
                        <Label>Email</Label>
                        <Input value={user?.email || ""} disabled />
                    </div>
                    <div>
                        <Label>Name</Label>
                        <Input value={formData.name} disabled />
                    </div>
                </div>
                <div className="flex justify-start gap-x-10 items-center">
                    <div>
                        <Label>Phone</Label>
                        <Input value={formData.phone} disabled />
                    </div>
                    <div>
                        <Label>Business Name</Label>
                        <Input value={formData.businessName} disabled />
                    </div>
                </div>
                <div className="flex justify-start gap-x-10 items-center">
                    <div>
                        <Label>Address</Label>
                        <Input value={formData.address} disabled />
                    </div>
                    <div>
                        <Label>Default Currency</Label>
                        <Input value={formData.defaultCurrency} disabled />
                    </div>
                </div>
                <div>
                    <Label>GST Slabs</Label>
                    {formData.gstSlabs.map((slab, idx) => (
                        <Input
                            key={idx}
                            value={`${slab.label} (${slab.value}%)`}
                            disabled
                            className="mb-2"
                        />
                    ))}
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Update Profile</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                placeholder="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Business Name"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Address"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleChange}
                            />
                            <select
                                name="defaultCurrency"
                                value={formData.defaultCurrency}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="AED">AED</option>
                            </select>
                            {formData.gstSlabs.map((slab, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="Label"
                                        value={slab.label}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData((prev) => {
                                                const updated = [...prev.gstSlabs];
                                                updated[index].label = value;
                                                return { ...prev, gstSlabs: updated };
                                            });
                                        }}
                                    />
                                    <Input
                                        placeholder="Value"
                                        type="number"
                                        value={slab.value}
                                        onChange={(e) => handleGstSlabChange(index, +e.target.value)}
                                    />
                                </div>
                            ))}
                            <Button onClick={handleAddGstSlab} type="button" variant="outline">
                                + Add GST Slab
                            </Button>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
