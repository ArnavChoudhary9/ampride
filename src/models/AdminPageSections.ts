export enum AdminPageSection {
  Rides = "Rides",
  Drivers = "Drivers"
}

export enum AdminPageSubsection {
  New = "New",
  Existing = "Existing",
  Delete = "Delete",
  Cancel = "Cancel"
}

export const AdminPageSectionToSubsections: Record<AdminPageSection, AdminPageSubsection[]> = {
  [AdminPageSection.Rides]: [
    AdminPageSubsection.New,
    AdminPageSubsection.Existing,
    AdminPageSubsection.Cancel
  ],
  [AdminPageSection.Drivers]: [
    AdminPageSubsection.New,
    AdminPageSubsection.Existing,
    AdminPageSubsection.Delete
  ]
};
