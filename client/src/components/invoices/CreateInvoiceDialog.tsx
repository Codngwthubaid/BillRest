import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/store/invoice.store";
import type { CreateInvoicePayload } from "@/types/invoice.types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const defaultForm: CreateInvoicePayload = {
    customerName: "",
    phoneNumber: "",
    currency: "INR",
    paymentMethod: "Cash",
    products: [{ product: "", quantity: "", price: "", gstRate: "" }],
};

export default function CreateInvoiceDialog({ open, onOpenChange }: Props) {
    const [form, setForm] = useState<CreateInvoicePayload>(defaultForm);
    const { createInvoice } = useInvoiceStore();

    const handleAddProduct = () => {
        setForm({
            ...form,
            products: [...form.products, { product: "", quantity: "", price: "", gstRate: "" }],
        });
    };

    const handleChangeProduct = (index: number, field: string, value: any) => {
        const updated = [...form.products];
        updated[index] = { ...updated[index], [field]: value };
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div>
                        <label className="text-sm">Products</label>
                        <div className="space-y-2">
                            {form.products.map((p, idx) => (
                                <div key={idx} className="grid grid-cols-4 gap-2 items-center">
                                    <Input
                                        placeholder="Product"
                                        value={p.product}
                                        onChange={(e) => handleChangeProduct(idx, "product", e.target.value)}
                                        className="placeholder:text-gray-400"
                                    />
                                    <Input
                                        placeholder="Qty"
                                        type="number"
                                        value={p.quantity}
                                        onChange={(e) => handleChangeProduct(idx, "quantity", Number(e.target.value))}
                                        className="placeholder:text-gray-400"
                                    />
                                    <Input
                                        placeholder="Price"
                                        type="number"
                                        value={p.price}
                                        onChange={(e) => handleChangeProduct(idx, "price", Number(e.target.value))}
                                        className="placeholder:text-gray-400"
                                    />
                                    <Input
                                        placeholder="GST %"
                                        type="number"
                                        value={p.gstRate}
                                        onChange={(e) => handleChangeProduct(idx, "gstRate", Number(e.target.value))}
                                        className="placeholder:text-gray-400"
                                    />
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={handleAddProduct}>
                                + Add Product
                            </Button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                            Create Invoice
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
