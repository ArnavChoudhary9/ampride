import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { AutoComplete } from "@/components/ui/autocomplete"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { UserModel } from "@/models/user"
import { useAdminPage } from "@/hooks/use-admin-page"
import { AdminPageSection, AdminPageSubsection } from "@/models/AdminPageSections"

interface NewDriverFormData {
  userId: string;
  email: string;
  license_number: string;
  license_expiry?: Date;
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export default function NewDriverPage() {
  const [emailSearch, setEmailSearch] = useState("");
  const [formData, setFormData] = useState<NewDriverFormData>({
    userId: '',
    email: '',
    license_number: '',
    license_expiry: new Date("2025-06-01"),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [month, setMonth] = useState<Date | undefined>(formData.license_expiry || new Date("2025-06-01"));
  const [value, setValue] = useState(formatDate(formData.license_expiry));

  // For License Expiry Date
  const [open, setOpen] = useState(false);
  const [allEmails, setAllEmails] = useState<Record<string, string>>({}); // Store all fetched emails as {id: email}
  const [driverUserData, setDriverUserData] = useState<UserModel | null>(null); // Store driver data if needed

  const { setSection, setSubSection } = useAdminPage();

  useEffect(() => {
    const fetchEmails = async () => {
      const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?
        `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` :
        "http://localhost:3000";

      try {
        // Fetch users who are not admins yet
        const data = await fetch(`${BASE_URL}/api/emails?admins=false`).then(res => res.json());
        setAllEmails(data.userEmails || {});
      } catch (err) {
        console.error("Error fetching emails:", err);
        setError("Failed to load email suggestions");
      } finally {
        setIsLoadingSuggestions(false);
      }
    }
    fetchEmails();
  }, []);

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!formData.userId) {
        setDriverUserData(null); // Reset driver data if no user is selected
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", formData.userId)
        .single();

      if (error) {
        console.error("Error fetching driver data:", error);
        setError("Failed to load driver data");
        setDriverUserData(null); // Reset driver data on error
      } else {
        setDriverUserData(data);
        data.email = allEmails[formData.userId] || data.email; // Ensure email is set
      }
    }
    fetchDriverData();
  }, [allEmails, formData.userId]);

  const filteredEmailItems = useMemo(() => {
    const entries = Object.entries(allEmails);
    const items = entries.map(([id, email]) => ({ value: id, label: email }));

    if (!emailSearch) {
      return items;
    }
    return items.filter(item => item.label.toLowerCase().includes(emailSearch.toLowerCase()));
  }, [emailSearch, allEmails]);

  const handleUserSelectionChange = (userId: string) => {
    const selectedEmail = allEmails[userId] || '';
    setFormData(prev => ({ ...prev, userId, email: selectedEmail }));
    setEmailSearch(selectedEmail); // Update search input to show full email
  };

  const handleNewDriver = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      setError("Please select a valid email from the list.");
      return;
    }

    if (!formData.license_expiry || !isValidDate(formData.license_expiry)) {
      setError("Please provide a valid license expiry date.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: insertError } = await supabase.from("drivers").insert({
      id: formData.userId,
      license_number: formData.license_number,
      license_expiry: formData.license_expiry.toISOString(),
    });

    if (insertError) {
      console.error("Error creating new driver:", insertError);
      setError(`Failed to create new driver: ${insertError.message}`);
    } else {
      setSection(AdminPageSection.Drivers);
      setSubSection(AdminPageSubsection.Existing);
    }

    setIsLoading(false);
  }

  return (
    <div className="p-4 pt-0 w-full">
      <form onSubmit={handleNewDriver}>
        <div className="flex flex-col gap-6 w-full">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <AutoComplete
              selectedValue={formData.userId}
              onSelectedValueChange={handleUserSelectionChange}
              searchValue={emailSearch}
              onSearchValueChange={setEmailSearch}
              items={filteredEmailItems}
              isLoading={isLoadingSuggestions}
              emptyMessage="No matching emails found."
              placeholder="Search for a user by email..."
            />
          </div>

          {driverUserData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={driverUserData.name} disabled />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={driverUserData.phone_number} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="license_number">Licence Number</Label>
                  <Input
                    id="license_number"
                    type="text"
                    value={formData.license_number}
                    onChange={e => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="date">License Expiry Date</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      value={value}
                      placeholder="June 01, 2025"
                      className="bg-background pr-10"
                      onChange={(e) => {
                        const date = new Date(e.target.value)
                        setValue(e.target.value)
                        if (isValidDate(date)) {
                          setFormData(prev => ({ ...prev, license_expiry: date }))
                          setMonth(date)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault()
                          setOpen(true)
                        }
                      }}
                    />
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-picker"
                          variant="ghost"
                          className="absolute top-0 right-0 h-full px-3"
                        >
                          <CalendarIcon className="size-3.5" />
                          <span className="sr-only">Select date</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                      >
                        <Calendar
                          mode="single"
                          selected={formData.license_expiry}
                          captionLayout="dropdown"
                          startMonth={new Date()}
                          endMonth={new Date(new Date().getFullYear() + 30, 11)}
                          month={month}
                          onMonthChange={setMonth}
                          onSelect={(date) => {
                            setFormData(prev => ({ ...prev, license_expiry: date }))
                            setValue(formatDate(date))
                            setOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading || !formData.userId}>
              {isLoading ? "Adding..." : "Add Driver"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
