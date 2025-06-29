import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/store/invoice.store";
import type { CreateInvoicePayload } from "@/types/invoice.types";
import { useProductStore } from "@/store/product.store";
import { useBusinessStore } from "@/store/business.store";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const defaultForm: CreateInvoicePayload = {
    customerName: "",
    phoneNumber: "",
    currency: "INR",
    paymentMethod: "Cash",
    status: "draft",
    products: [{ product: "", quantity: "", price: "", gstRate: "" }],
    customerState: "",
    businessState: "",
    posPrint: "A4" // ✅ default posPrint
};

export default function CreateInvoiceDialog({ open, onOpenChange }: Props) {
    const [form, setForm] = useState<CreateInvoicePayload>(defaultForm);
    const { createInvoice } = useInvoiceStore();
    const { products, fetchProducts } = useProductStore();
    const { business, fetchBusiness } = useBusinessStore();

    const handleAddProduct = () => {
        setForm({
            ...form,
            products: [...form.products, { product: "", quantity: "", price: "", gstRate: "" }],
        });
    };

    const handleChangeProduct = (index: number, field: string, value: any) => {
        const updated = [...form.products];

        if (field === "product") {
            const selectedProduct = products.find((p) => p._id === value);
            if (selectedProduct) {
                updated[index] = {
                    ...updated[index],
                    product: selectedProduct._id,
                    price: String(selectedProduct.price),
                    gstRate: String(selectedProduct.gstRate),
                };
            }
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }

        setForm({ ...form, products: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createInvoice(form);
        if (res) {
            onOpenChange(false);
            setForm(defaultForm);
        }
    };

    useEffect(() => {
        if (open) {
            fetchProducts();
            fetchBusiness();
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Invoice</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm">Customer Name</label>
                            <Input
                                value={form.customerName}
                                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                                required
                                placeholder="Enter customer name"
                                className="placeholder:text-gray-400"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="text-sm">Phone Number</label>
                            <Input
                                value={form.phoneNumber}
                                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                required
                                placeholder="Enter phone number"
                                type="tel"
                                className="placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="text-sm">Customer State</label>
                            <Input
                                value={form.customerState}
                                onChange={(e) => setForm({ ...form, customerState: e.target.value })}
                                required
                                placeholder="Enter customer state"
                                className="placeholder:text-gray-400"
                                type="text"
                            />
                        </div>

                        <div>
                            <label className="text-sm">Business State</label>
                            <Input
                                value={form.businessState}
                                onChange={(e) => setForm({ ...form, businessState: e.target.value })}
                                required
                                placeholder="Enter business state"
                                className="placeholder:text-gray-400"
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm">Currency</label>
                            <select
                                className="w-full border rounded p-2 text-sm"
                                value={form.currency}
                                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="AED">AED</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm">Payment Method</label>
                            <select
                                className="w-full border rounded p-2 text-sm"
                                value={form.paymentMethod}
                                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as any })}
                            >
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Card">Card</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm">Status</label>
                            <select
                                className="w-full border rounded p-2 text-sm"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                            >
                                <option value="draft">Draft</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm">POS Print</label>
                            <select
                                className="w-full border rounded p-2 text-sm"
                                value={form.posPrint}
                                onChange={(e) => setForm({ ...form, posPrint: e.target.value as "58mm" | "80mm" | "A4" | "disabled" })}
                            >
                                <option value="A4">A4</option>
                                <option value="80mm">80mm</option>
                                <option value="58mm">58mm</option>
                                <option value="disabled">Disabled</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm">Products</label>
                        <div className="space-y-2">
                            {form.products.map((p, idx) => (
                                <div key={idx} className="grid grid-cols-4 gap-2 items-center">
                                    <select
                                        className="w-full border rounded p-2 text-sm"
                                        value={p.product}
                                        onChange={(e) => handleChangeProduct(idx, "product", e.target.value)}
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((prod) => (
                                            <option key={prod._id} value={prod._id}>
                                                {prod.name}
                                            </option>
                                        ))}
                                    </select>

                                    <Input
                                        placeholder="Qty"
                                        type="number"
                                        value={p.quantity}
                                        onChange={(e) => handleChangeProduct(idx, "quantity", String(e.target.value))}
                                        className="placeholder:text-gray-400"
                                    />

                                    <Input
                                        placeholder="Price"
                                        type="number"
                                        value={p.price}
                                        onChange={(e) => handleChangeProduct(idx, "price", String(e.target.value))}
                                        className="placeholder:text-gray-400"
                                    />

                                    <select
                                        className="w-full border rounded p-2 text-sm"
                                        value={p.gstRate}
                                        onChange={(e) => handleChangeProduct(idx, "gstRate", String(e.target.value))}
                                    >
                                        <option value="">Select GST %</option>
                                        {business?.gstSlabs?.map((slab) => (
                                            <option key={slab.value} value={slab.value}>
                                                {slab.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={handleAddProduct}>
                                + Add Product
                            </Button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            Create Invoice
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

