'use client';

import { AppSidebar } from "@/components/admin/sidebar"
import { AdminPageProvider } from "@/hooks/use-admin-page"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import AdminPage from "@/components/admin/admin-page";
import AdminPageBreadcrumb from "@/components/admin/breadcrumb";

export default function AdminPageContainer() {
  return (
    <AdminPageProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <AdminPageBreadcrumb />
            </div>
          </header>
          <AdminPage />
        </SidebarInset>
      </SidebarProvider>
    </AdminPageProvider>
  )
}
