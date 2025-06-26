import UserProfileDetails from "@/components/profile/UserProfileDetails";
import ProfileStats from "@/components/profile/ProfileStats";

export default function ProfilePage() {
  return (
    <div className="mx-auto px-4 py-10 flex flex-col md:flex-row justify-center items-start gap-5">
      <UserProfileDetails />
      <ProfileStats />
    </div>
  );
}
