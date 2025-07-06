import ProfileStats from "@/components/profile/ProfileStats";
import UserProfileDetails from "@/components/profile/UserProfileDetails";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilePage() {

    const [isLoading, setIsLoading] = useState(true)

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
        <div className="space-y-6 px-4 py-10 mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p>Manage your personal information and view your activity</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <UserProfileDetails />
                <ProfileStats />
            </div>
        </div>
    );
}

