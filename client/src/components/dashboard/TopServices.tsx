import { useReportStore } from "@/store/report.store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Stethoscope } from "lucide-react";

export default function TopServices() {
  const { healthReport } = useReportStore();

  return (
    <Card className="rounded-lg shadow-sm border">
      <CardHeader className="border-b pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Top Services</CardTitle>
          <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          {healthReport?.topServices?.slice(0, 4).map((service, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm">{service.quantity || 0} times provided</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{service.totalSales.toFixed(2)}</p>
              </div>
            </div>
          ))}
          {!healthReport?.topServices?.length && (
            <p className="text-sm">No services found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
