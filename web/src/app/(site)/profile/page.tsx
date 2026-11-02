import { pageMetadata } from "@/lib/seo";
import ProfileView from "@/components/profile/ProfileView";

export const metadata = pageMetadata({
  title: "My Profile",
  description: "Your StartupHealer startup profile.",
  path: "/profile",
  noindex: true,
});

export default function ProfilePage() {
  return <ProfileView />;
}
