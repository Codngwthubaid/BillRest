import { useAuthStore } from "@/store/auth.store"
import ProductPageForAdminPanel from "@/components/product/ProductPageForAdminPanel"
import ProductPageForCustomerPanel from "@/components/product/ProductPageForCustomerPanel"
import ProductPageForSupportPanel from "@/components/product/ProductPageForSupportPanel"


export default function ProductsPage() {

    const { user } = useAuthStore();

    return (
        <>
            {user?.role === "customer" && <ProductPageForCustomerPanel />}
            {user?.role === "support" && <ProductPageForSupportPanel />}
            {user?.role === "master" && <ProductPageForAdminPanel />}
        </>
    )
}