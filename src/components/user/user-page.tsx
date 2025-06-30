import { UserPageSection } from "@/models/UserPageSections";
import { useUserPage } from "@/hooks/use-user-page";

// Pages
import SearchPage from "@/components/user/pages/search";
import YourRidesPage from "@/components/user/pages/your-rides";
import InboxPage from "@/components/user/pages/inbox";
import ProfilePage from "@/components/user/pages/profile";

export default function UserPage() {
  const { section } = useUserPage();

  return (
    <div>
      {section === UserPageSection.Search && <SearchPage />}
      {section === UserPageSection.YourRides && <YourRidesPage />}
      {section === UserPageSection.Inbox && <InboxPage />}
      {section === UserPageSection.Profile && <ProfilePage />}
    </div>
  );
}
