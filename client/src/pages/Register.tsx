import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone must be 10 digits")
    .max(10, "Phone must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  type: z.enum(["billrest_general", "billrest_health"]),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = type selection, 2 = form

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      const response = await registerUser(data);
      login(response.user, response.token);
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  const handleTypeSelect = (type: "billrest_general" | "billrest_health") => {
    setValue("type", type);
    setStep(2);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-background px-4">
      <Card className="w-full max-w-md shadow-lg py-10">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <img
              src="/Billrest_20250626_235033_0006.png"
              className="bg-transparent w-60"
              alt="Billrest Logo"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-4">
                  Choose Your Account Type
                </h2>
                <div className="flex gap-x-4 w-full justify-center">
                  <Button
                    type="button"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-lg p-10 rounded-xl"
                    onClick={() => handleTypeSelect("billrest_general")}
                  >
                    Billrest General
                  </Button>
                  <Button
                    type="button"
                    className="cursor-pointer bg-green-600 hover:bg-green-700 text-white text-lg p-10 rounded-xl"
                    onClick={() => handleTypeSelect("billrest_health")}
                  >
                    Billrest Health
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <>
                <div>
                  <Input placeholder="Name" {...register("name")} />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Email"
                    type="email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input placeholder="Phone" {...register("phone")} />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <span
                    className="text-primary cursor-pointer hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    Login here
                  </span>
                </p>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
