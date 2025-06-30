'use client';

import { FloatingDock } from "@/components/ui/floating-dock";
import { UserPageSection } from "@/models/UserPageSections";
import { useUserPage } from "@/hooks/use-user-page";

import {
  IconSearch,
  IconCar,
  IconInbox,
  IconUser
} from "@tabler/icons-react";

export default function UserNav() {
  const { setSection } = useUserPage();

  const links = [
    {
      title: "Search",
      icon: (
        <IconSearch className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => { setSection(UserPageSection.Search); }
    },
    {
      title: "Your Rides",
      icon: (
        <IconCar className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => { setSection(UserPageSection.YourRides); }
    },
    {
      title: "Inbox",
      icon: (
        <IconInbox className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => { setSection(UserPageSection.Inbox); }
    },
    {
      title: "Profile",
      icon: (
        <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => { setSection(UserPageSection.Profile); }
    },
  ];

  return (
    <div className="fixed flex bottom-4 left-6 justify-center md:left-0 md:w-full">
      <FloatingDock items={links} />
    </div>
  );
}
