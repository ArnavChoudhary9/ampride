import {
  createContext,
  createElement,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { AdminPageSection, AdminPageSubsection } from "@/models/AdminPageSections";

type AdminPageContextType = {
  section: AdminPageSection;
  setSection: (section: AdminPageSection) => void;
  subSection: AdminPageSubsection;
  setSubSection: (subSection: AdminPageSubsection) => void;
};

const AdminPageContext = createContext<AdminPageContextType | undefined>(undefined);

export function AdminPageProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<AdminPageSection>(AdminPageSection.Rides);
  const [subSection, setSubSection] = useState<AdminPageSubsection>(AdminPageSubsection.Existing);

  return createElement(
    AdminPageContext.Provider,
    { value: { section, setSection, subSection, setSubSection } },
    children
  );
}

export function useAdminPage() {
  const context = useContext(AdminPageContext);
  if (!context) {
    throw new Error("useAdminPage must be used within an AdminPageProvider");
  }
  return context;
}
