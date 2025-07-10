import { Calendar, Mail, Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";

export default function SupportProfile() {
    const { user } = useAuthStore();

    return (
        <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-lg shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-6 mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {user?.name?.charAt(0) || "?"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
                            <p>{user?.email || "N/A"}</p>
                            <p className="text-sm capitalize">
                                {user?.role?.replace("_", " ") || "N/A"}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Joined {new Date().toISOString().slice(0, 10)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium mb-2">Full Name</p>
                            <div className="flex items-center space-x-3">
                                <User className="w-4 h-4" />
                                <span>{user?.name || "N/A"}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-2">Email Address</p>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4" />
                                <span>{user?.email || "N/A"}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-2">Phone Number</p>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4" />
                                <span>{user?.phone || "N/A"}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-2">Role</p>
                            <div className="flex items-center space-x-3">
                                <User className="w-4 h-4" />
                                <span className="capitalize">{user?.role || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
