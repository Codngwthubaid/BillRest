import { useAuthStore } from "@/store/auth.store";
import ProfilePageForAdminPanel from "@/components/profile/ProfilePageForAdminPanel";
import ProfilePageForCustomerPanel from "@/components/profile/ProfilePageForCustomerPanel";
import ProfilePageForSupportPanel from "@/components/profile/ProfilePageForSupportPanel";

export default function ProfilePage() {

  const { user } = useAuthStore()

  return (
    <>
      {user?.role === "customer" && <ProfilePageForCustomerPanel />}
      {user?.role === "support" && <ProfilePageForSupportPanel />}
      {user?.role === "master" && <ProfilePageForAdminPanel />}
    </>
  )
}