'use client';

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconSearch,
  IconCar,
  IconInbox,
  IconUser
} from "@tabler/icons-react";

export default function UserPage() {
  const links = [
    {
      title: "Search",
      icon: (
        <IconSearch className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {}
    },
    {
      title: "Your Rides",
      icon: (
        <IconCar className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {}
    },
    {
      title: "Inbox",
      icon: (
        <IconInbox className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {}
    },
    {
      title: "Profile",
      icon: (
        <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {}
    },
  ];

  return (
    <div className="fixed flex bottom-4 left-6 justify-center md:left-0 md:w-full">
      <FloatingDock items={links} />
    </div>
  );
}
