// Generička kategorija — id iz DEMO_CATEGORIES (npr. "tretmani"), ne hardkodovana unija.
export type Category = string;

export type Service = {
  id: string;
  name: string;
  category: Category;
  duration_minutes: number;
  price: number;
  description?: string;
  icon?: string;
};

export type StaffMember = {
  id: string;
  full_name: string;
};

// Spojeni termin za "Bilo ko slobodan": jedno vreme + radnici slobodni baš tada.
// freeStaff služi SAMO za prikaz; konačna dodela se reproverava pri upisu.
export type MergedSlot = {
  startUtcISO: string;
  label: string; // beogradsko zidno vreme, npr "12:00"
  freeStaff: { id: string; ime: string }[];
};
