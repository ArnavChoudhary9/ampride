import { useAdminPage } from "@/hooks/use-admin-page";
import { AdminPageSection, AdminPageSubsection } from "@/models/AdminPageSections";

// pages
import NewDriverPage from "@/components/admin/pages/driver/new";

export default function AdminPage() {
  const { section, subSection } = useAdminPage();

  return (
    <>
      {(section === AdminPageSection.Drivers) && (
        <>
          {subSection === AdminPageSubsection.New && <NewDriverPage />}
          {subSection === AdminPageSubsection.Existing && <h1>Existing Drivers</h1>}
          {subSection === AdminPageSubsection.Delete && <h1>Delete Driver</h1>}
        </>
      )}
    </>
  );
}
