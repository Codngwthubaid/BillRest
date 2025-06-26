import { useReportStore } from "@/store/report.store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Package } from "lucide-react";

export default function TopProducts() {
  const { data } = useReportStore();

  return (
    <Card className="rounded-lg shadow-sm border">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Top Products</CardTitle>
          <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.topProducts?.slice(0, 4).map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm">{product.quantity || 0} units sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{product.totalSales.toFixed(2)}</p>
              </div>
            </div>
          ))}
          {!data?.topProducts?.length && (
            <p className="text-sm">No products found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}