'use client';

import { UserPageProvider } from "@/hooks/use-user-page";
import UserNav from "@/components/user/user-nav";
import UserPage from "@/components/user/user-page";

export default function UserPageContainer() {
  return (
    <UserPageProvider>
      <UserNav />
      <UserPage />
    </UserPageProvider>
  );
}
