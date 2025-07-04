import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Frown } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md text-center shadow-2xl rounded-2xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Frown className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Sorry, the page you are looking for does not exist.
          </p>
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
