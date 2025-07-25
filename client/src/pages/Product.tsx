import { useEffect, useState } from "react";
import {
    Plus, Search, Edit, Trash2, Package, Barcode, Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/store/product.store";
import CreateProductDialog from "@/components/product/CreateProductDialog";
import UpdateProductDialog from "@/components/product/UpdateProductDialog";
import DeleteProductDialog from "@/components/product/DeleteProductDialog";
import type { Product } from "@/types/product.types"
import { useAuthStore } from "@/store/auth.store";

export default function ProductsPage() {
    const { user } = useAuthStore();
    const {
        products, fetchProducts, editProduct, removeProduct,
        allProducts, fetchAllProducts
    } = useProductStore();

    console.log("All Products", allProducts)

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState("");


    const isCustomer = user?.role === "customer";
    const isSupportOrMaster = user?.role === "support" || user?.role === "master";
    const data = isCustomer ? products : allProducts ?? [];
    const uniqueEmails = Array.from(new Set((Array.isArray(data) ? data : []).map(p => p.user?.email).filter(Boolean)));


    useEffect(() => {
        if (isCustomer) {
            fetchProducts();
        } else if (isSupportOrMaster) {
            fetchAllProducts();
        }
    }, [user?.role, fetchProducts, fetchAllProducts, isCustomer, isSupportOrMaster]);

    const categories = [...new Set((Array.isArray(data) ? data : []).map(p => p.category))];

    const filtered = (Array.isArray(data) ? data : []).filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        const matchesEmail = !selectedEmail || product.user?.email === selectedEmail;
        return matchesSearch && matchesCategory && matchesEmail;
    });


    const getStockStatus = (stock: number) => {
        if (stock === 0) return 'text-red-600 bg-red-100';
        if (stock <= 10) return 'text-orange-600 bg-orange-100';
        return 'text-green-600 bg-green-100';
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin size-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p>Manage your product inventory</p>
                </div>
                {isCustomer && (
                    <>
                        <Button onClick={() => setShowCreateDialog(true)}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4" />
                            <span>Add Product</span>
                        </Button>
                        <CreateProductDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
                    </>
                )}
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>

                {user?.role !== "customer" && (
                    <select
                        value={selectedEmail}
                        onChange={(e) => setSelectedEmail(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
                    >
                        <option value="">All Users</option>
                        {uniqueEmails.map(email => (
                            <option key={email} value={email}>{email}</option>
                        ))}
                    </select>
                )}
            </div>


            {/* Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                    <Card key={product._id} className="overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Package className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{product.name}</h3>
                                    </div>
                                </div>
                                {isCustomer && (
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="sm"
                                            onClick={() => { setSelectedProduct(product); setShowUpdateDialog(true); }}
                                            className="hover:text-blue-600">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm"
                                            onClick={() => { setSelectedProduct(product); setShowDeleteDialog(true); }}
                                            className="hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm mb-4">{product.description}</p>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">Price:</span>
                                    <span className="font-semibold">₹{product.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Category:</span>
                                    <span className="text-sm font-medium">{product.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Stock:</span>
                                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStockStatus(product.stock)}`}>
                                        {product.stock} units
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Tax Rate:</span>
                                    <span className="text-sm font-medium">{product.gstRate}%</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                                <Button className="flex items-center justify-center space-x-2 flex-1 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100">
                                    <Barcode className="w-4 h-4" />
                                    <span>{product.barcode}</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            )}

            <UpdateProductDialog
                open={showUpdateDialog}
                product={selectedProduct}
                onClose={() => setShowUpdateDialog(false)}
                onUpdate={async (id, updatedFields) => {
                    await editProduct(id, updatedFields);
                    setShowUpdateDialog(false);
                }}
            />

            <DeleteProductDialog
                open={showDeleteDialog}
                productName={selectedProduct?.name || ""}
                onClose={() => setShowDeleteDialog(false)}
                onConfirmDelete={async () => {
                    if (!selectedProduct?._id) return;
                    await removeProduct(selectedProduct._id);
                    setShowDeleteDialog(false);
                }}
            />
        </div>
    );
}
