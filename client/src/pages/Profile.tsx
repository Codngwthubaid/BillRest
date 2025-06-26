import ProfileStats from "@/components/profile/ProfileStats";
import UserProfileDetails from "@/components/profile/UserProfileDetails";

export default function ProfilePage() {
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

