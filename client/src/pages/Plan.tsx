import { useEffect } from "react";
import { useSubscriptionStore } from "@/store/subscription.store";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Plans() {
  const {
    availablePlans,
    fetchAllPlans,
    createOrder,
    handlePaymentVerification,
  } = useSubscriptionStore();

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllPlans();
  }, [fetchAllPlans]);

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
      const { orderId, amount } = await createOrder(planId);

      const razorpay = new (window as any).Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        name: "Subscription Payment",
        amount: amount * 100,
        currency: "INR",
        order_id: orderId,
        handler: async function (response: any) {
          const result = await handlePaymentVerification(
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            planId
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
        theme: {
          color: "#6366f1",
        },
      });

      razorpay.open();
    } catch (err) {
      toast.error("Unable to start payment");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availablePlans.map((plan) => (
          <Card key={plan._id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Duration: {plan.durationInDays} days</p>
              <p>Price: ₹{plan.price}</p>
              <Button className="w-full mt-2" onClick={() => handleBuyPlan(plan._id)}>
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
