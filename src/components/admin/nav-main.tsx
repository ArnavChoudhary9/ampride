"use client"

import { ChevronRight } from "lucide-react"
import { useAdminPage } from "@/hooks/use-admin-page"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  AdminPageSection,
  AdminPageSectionToSubsections,
} from "@/models/AdminPageSections"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain() {
  const { setSection, setSubSection } = useAdminPage();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {Object.entries(AdminPageSectionToSubsections).map(([section, subsections]) => (
          <Collapsible
            key={section}
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={section}>
                  <span>{section}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {subsections.map((sub) => (
                    <SidebarMenuSubItem key={sub}>
                      <SidebarMenuSubButton onClick={() => {
                        setSection(section as AdminPageSection);
                        setSubSection(sub);
                      }}>
                        <span className="select-none">{sub}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
