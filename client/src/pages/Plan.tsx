import { useEffect, useState } from "react";
import { usePlanStore } from "@/store/plan.store";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createOrder, verifyAndActivate } from "@/services/subscription.service";
import { Loader2 } from "lucide-react";

export default function Plans() {
  const {
    packagePlans,
    individualPlans,
    fetchPackagePlans,
    fetchIndividualPlans
  } = usePlanStore();

  const [isLoading, setIsLoading] = useState(true)
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackagePlans();
    fetchIndividualPlans();
  }, [fetchPackagePlans, fetchIndividualPlans]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const handleBuyPlan = async (planId: string) => {
    try {
      await loadRazorpayScript();
      // 🔥 You'll adapt createOrder etc. to new plan module
      // Keeping same structure here, or move to plan.store as needed
      const { orderId, amount } = await createOrder(planId);

      const razorpay = new (window as any).Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        name: "Subscription Payment",
        amount: amount * 100,
        currency: "INR",
        order_id: orderId,
        handler: async function (response: any) {
          const result = await verifyAndActivate(
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId
            },
          );

          if (result) {
            toast.success("Subscription activated");
            navigate("/dashboard");
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: "#6366f1" },
      });

      razorpay.open();
    } catch (err) {
      toast.error("Unable to start payment");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold animate-pulse text-blue-600">
          <Loader2 className="animate-spin size-12" />
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h1>

      {Array.isArray(packagePlans) && packagePlans.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {packagePlans.map((plan) => (
              <Card key={plan._id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Duration: {plan.durationInDays} days</p>
                  <p>₹{plan.pricePerMonth}/month - ₹{plan.totalPrice} total</p>
                  {plan.description && <p className="text-sm text-gray-500">{plan.description}</p>}
                  <Button className="dark:text-white w-full mt-2 bg-blue-600 hover:bg-blue-700" onClick={() => handleBuyPlan(plan._id)}>
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {Array.isArray(individualPlans) && individualPlans.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Add-On Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {individualPlans.map((plan) => (
              <Card key={plan._id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>₹{plan.pricePerMonth}/month</p>
                  {plan.description && <p className="text-sm text-gray-500">{plan.description}</p>}
                  <Button className="dark:text-white w-full mt-2 bg-blue-600 hover:bg-blue-700" onClick={() => handleBuyPlan(plan._id)}>
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
