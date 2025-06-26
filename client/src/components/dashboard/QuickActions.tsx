import { useAuthStore } from "@/store/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FileText, Package, ShoppingCart } from "lucide-react";

export default function QuickActions() {
    const { user } = useAuthStore();

    return (
        <Card className="rounded-lg shadow-sm border">
            <CardHeader className="border-b pt-6">
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="flex items-center justify-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-700">Create Invoice</span>
                    </Button>
                    {(user?.role === 'master' || user?.role === 'customer') && (
                        <Button className="flex items-center justify-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                            <Package className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-700">Add Product</span>
                        </Button>
                    )}
                    <Button className="flex items-center justify-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-700">Add Customer</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}