import { useEffect, useState } from "react";
import { usePlanStore } from "@/store/plan.store";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";
import { createOrder, verifyAndActivate } from "@/services/subscription.service";

export default function Plans() {
  const {
    packagePlans,
    individualPlans,
    fetchPackagePlans,
    fetchIndividualPlans
  } = usePlanStore();

  const [isLoading, setIsLoading] = useState(true);
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
      const { orderId, amount } = await createOrder(planId);

      const razorpay = new (window as any).Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        name: "Subscription Payment",
        amount: amount * 100,
        currency: "INR",
        order_id: orderId,
        handler: async function (response: any) {
          const result = await verifyAndActivate({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planId
          });

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
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="animate-spin size-12 text-blue-600 mx-auto mb-4" />
          <p className="text-xl font-semibold">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto">
      <div className="px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Perfect Plan</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Scale your business with our flexible pricing plans. No hidden fees.
          </p>
        </div>

        {packagePlans?.length > 0 && (
          <div className="mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packagePlans.map((plan) => (
                <div
                  key={plan._id}
                  className={`relative rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:bg-[#171717]`}
                >
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    </div>

                    <ul className="list-disc list-inside space-y-2 mb-6">
                      {Array.isArray(plan.description) ? (
                        plan.description.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))
                      ) : (
                        <li>{plan.description}</li>
                      )}
                    </ul>

                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold">₹{plan.pricePerMonth}</span>
                      <div className="text-gray-600">/month</div>
                      <div className="text-sm mt-1">
                        {plan.durationInDays} days • ₹{plan.totalPrice} total
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyPlan(plan._id)}
                      className={`w-full py-4 px-6 rounded-xl border-2 font-semibold text-lg transition-all duration-300 hover:text-blue-500 hover:bg-blue-50`}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {individualPlans?.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Add-On Services</h2>
              <p className="text-gray-600">Boost your website with powerful additional features</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {individualPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-[#171717]"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="text-sm">{plan.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">₹{plan.pricePerMonth}</span>
                        <span className="text-gray-600">/month</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyPlan(plan._id)}
                      className="w-full hover:text-blue-500 hover:bg-blue-50 py-3 px-6 border-2 rounded-xl font-semibold transition-all duration-300"
                    >
                      Add to Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
