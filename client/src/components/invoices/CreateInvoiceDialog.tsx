import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/store/invoice.store";
import { useProductStore } from "@/store/product.store";
import { useBusinessStore } from "@/store/business.store";
import type { CreateInvoicePayload, Invoice } from "@/types/invoice.types";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import POSReceipt58mm from "@/components/invoices/POSReceipt58mm";
import POSReceipt80mm from "@/components/invoices/POSReceipt80mm";

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
    products: [{ product: "", quantity: 0, price: 0, gstRate: 0, discount: 0 }],
    customerState: "",
    businessState: "",
};

export default function CreateInvoiceDialog({ open, onOpenChange }: Props) {
    const [form, setForm] = useState<CreateInvoicePayload>(defaultForm);
    const [previewType, setPreviewType] = useState<"A4" | "58mm" | "80mm">("A4");

    const previewRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: previewRef,
    });

    const { createInvoice } = useInvoiceStore();
    const { products, fetchProducts } = useProductStore();
    const { business, fetchBusiness } = useBusinessStore();


    useEffect(() => {
        if (open) {
            fetchProducts();
            fetchBusiness();
        }
    }, [open]);

    const handleAddProduct = () => {
        setForm({
            ...form,
            products: [...form.products, { product: "", quantity: 0, price: 0, gstRate: 0, discount: 0 }],
        });
    };

    const handleChangeProduct = (idx: number, field: string, value: any) => {
        const updated = [...form.products];
        updated[idx] = { ...updated[idx], [field]: field === "product" ? value : Number(value) };
        if (field === "product") {
            const selected = products.find((p) => p._id === value);
            if (selected) {
                updated[idx].price = selected.price;
                updated[idx].gstRate = selected.gstRate;
            }
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

    // Prepare preview invoice object
    const previewInvoice: Invoice = {
        _id: "",
        invoiceNumber: "PREVIEW",
        createdAt: new Date().toISOString(),
        customerName: form.customerName,
        phoneNumber: form.phoneNumber,
        products: form.products.map(p => ({
            name: products.find(pr => pr._id === p.product)?.name || "N/A",
            quantity: String(p.quantity),
            price: String(p.price),
            gstRate: String(p.gstRate),
            discount: String(p.discount ?? 0),
        })),
        subTotal: form.products.reduce((sum, p) => sum + (p.quantity * (p.price - (p.discount || 0))), 0),
        gstAmount: form.products.reduce((sum, p) => sum + (p.quantity * (p.price - (p.discount || 0)) * (Number(p.gstRate) / 100)), 0),
        totalAmount: form.products.reduce((sum, p) => sum + (p.quantity * (p.price - (p.discount || 0)) * (1 + Number(p.gstRate) / 100)), 0),
        cgstAmount: form.products.reduce((sum, p) => sum + (p.quantity * (p.price - (p.discount || 0)) * ((Number(p.gstRate) / 2) / 100)), 0),
        sgstAmount: form.products.reduce((sum, p) => sum + (p.quantity * (p.price - (p.discount || 0)) * ((Number(p.gstRate) / 2) / 100)), 0),
        igstAmount: 0,
        paymentMethod: form.paymentMethod,
        status: form.status,
        currency: ""
    };


    const previewBusiness = {
        businessName: business?.businessName || "",
        address: business?.address,
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[95vh] max-w-[95vw] p-6 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Invoice</DialogTitle>
                </DialogHeader>

                <div className="flex justify-start items-start gap-6 mt-4">

                    {/* Left side - Invoice Form */}
                    <form onSubmit={handleSubmit} className="w-1/2 col-span-2 space-y-6">

                        <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
                            <h3 className="text-lg font-medium mb-2">Invoice Detail</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="Customer Name"
                                    value={form.customerName}
                                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Phone Number"
                                    value={form.phoneNumber}
                                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Customer State"
                                    value={form.customerState}
                                    onChange={(e) => setForm({ ...form, customerState: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Business State"
                                    value={form.businessState}
                                    onChange={(e) => setForm({ ...form, businessState: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <select
                                    className="border rounded p-2 text-sm w-full"
                                    value={form.currency}
                                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                >
                                    <option value="INR">INR</option>
                                    <option value="USD">USD</option>
                                    <option value="AED">AED</option>
                                </select>
                                <select
                                    className="border rounded p-2 text-sm w-full"
                                    value={form.paymentMethod}
                                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as "Cash" | "UPI" | "Card" | "Other" })}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Card">Card</option>
                                    <option value="Other">Other</option>
                                </select>
                                <select
                                    className="border rounded p-2 text-sm w-full"
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "paid" | "pending" | "overdue" })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
                            <h3 className="text-lg font-medium mb-2">Products</h3>

                            {/* Labels Row */}
                            <div className="grid grid-cols-6 gap-3 text-sm font-semibold text-gray-600 mb-2">
                                <div>Product</div>
                                <div>Qty</div>
                                <div>Price</div>
                                <div>GST %</div>
                                <div>Discount %</div>
                            </div>

                            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                                {form.products.map((p, idx) => (
                                    <div key={idx} className="grid grid-cols-6 gap-3 items-center">
                                        <select
                                            className="border rounded p-2 text-sm"
                                            value={p.product}
                                            onChange={(e) => handleChangeProduct(idx, "product", e.target.value)}
                                        >
                                            <option value="">Select Product</option>
                                            {products.map((prod) => (
                                                <option key={prod._id} value={prod._id}>{prod.name}</option>
                                            ))}
                                        </select>

                                        <Input
                                            placeholder="Qty"
                                            type="number"
                                            value={p.quantity}
                                            onChange={(e) => handleChangeProduct(idx, "quantity", e.target.value)}
                                        />

                                        <Input
                                            placeholder="Price"
                                            type="number"
                                            value={p.price}
                                            onChange={(e) => handleChangeProduct(idx, "price", e.target.value)}
                                        />

                                        <select
                                            className="border rounded p-2 text-sm"
                                            value={p.gstRate}
                                            onChange={(e) => handleChangeProduct(idx, "gstRate", e.target.value)}
                                        >
                                            <option value="">GST %</option>
                                            {business?.gstSlabs?.map((slab) => (
                                                <option key={slab.value} value={slab.value}>{slab.label}</option>
                                            ))}
                                        </select>

                                        <Input
                                            placeholder="Discount"
                                            type="number"
                                            value={p.discount}
                                            onChange={(e) => handleChangeProduct(idx, "discount", e.target.value)}
                                        />

                                        <Button
                                            type="button"
                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                                            onClick={() => {
                                                const updated = [...form.products];
                                                updated.splice(idx, 1);
                                                setForm({ ...form, products: updated });
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button type="button" variant="outline" onClick={handleAddProduct}>
                                + Add Product
                            </Button>
                        </div>


                        <div className="flex gap-4">
                            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                                Create Invoice
                            </Button>
                        </div>
                    </form>

                    {/* Right side - Preview */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow max-h-[90vh] overflow-y-auto w-1/2">
                        <div className="flex space-x-4 mb-4 border-b">
                            <button
                                type="button"
                                onClick={() => setPreviewType("A4")}
                                className={`px-4 py-2 ${previewType === "A4" ? "border-b-2 border-black font-bold" : ""}`}
                            >
                                A4
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewType("58mm")}
                                className={`px-4 py-2 ${previewType === "58mm" ? "border-b-2 border-black font-bold" : ""}`}
                            >
                                58mm
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewType("80mm")}
                                className={`px-4 py-2 ${previewType === "80mm" ? "border-b-2 border-black font-bold" : ""}`}
                            >
                                80mm
                            </button>
                            <Button
                                type="button"
                                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handlePrint}
                            >
                                Print
                            </Button>
                        </div>
                        <div ref={previewRef} className="m-5">
                            {previewType === "A4" && <InvoicePreview invoice={previewInvoice} />}
                            {previewType === "58mm" && <POSReceipt58mm business={previewBusiness} invoice={previewInvoice} />}
                            {previewType === "80mm" && <POSReceipt80mm business={previewBusiness} invoice={previewInvoice} />}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
