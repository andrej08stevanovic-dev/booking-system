// Demo sadržaj za "Demo Doktor" reskin — NE dolazi iz baze (Faza 3 reskin plana).
// Oblik polja (duration_minutes, price) namerno prati postojeće tipove iz
// @/features/booking/types, da booking-flow komponente rade bez izmena.

export const DEMO_CLINIC = {
  name: "Demo Doktor",
  tagline: "Ordinacija estetske medicine",
  city: "Vranje",
};

export const DEMO_CATEGORIES = [
  { id: "tretmani", label: "Estetski tretmani" },
  { id: "dermatologija", label: "Dermatologija" },
];

export const DEMO_SERVICES = [
  {
    id: "konsultacija",
    category: "tretmani",
    name: "Konsultacija",
    description: "Prva konsultacija i individualni plan tretmana",
    duration_minutes: 30,
    price: 0,
    icon: "Stethoscope",
  },
  {
    id: "fileri",
    category: "tretmani",
    name: "Hijaluronski fileri",
    description: "Popunjavanje bora i konturisanje lica",
    duration_minutes: 45,
    price: 0,
    icon: "Sparkles",
  },
  {
    id: "botoks",
    category: "tretmani",
    name: "Botoks",
    description: "Relaksacija mimičkih mišića i prevencija bora",
    duration_minutes: 30,
    price: 0,
    icon: "Syringe",
  },
  {
    id: "mezoterapija",
    category: "tretmani",
    name: "Mezoterapija",
    description: "Kokteli vitamina za dubinsku hidrataciju kože",
    duration_minutes: 45,
    price: 0,
    icon: "Droplets",
  },
  {
    id: "biorevitalizacija",
    category: "tretmani",
    name: "Biorevitalizacija",
    description: "Intenzivna hidratacija i revitalizacija kože",
    duration_minutes: 30,
    price: 0,
    icon: "Flower2",
  },
  {
    id: "prp",
    category: "tretmani",
    name: "PRP tretman",
    description: "Regeneracija kože plazmom obogaćenom trombocitima",
    duration_minutes: 60,
    price: 0,
    icon: "HeartPulse",
  },
  {
    id: "dermatoloski-pregled",
    category: "dermatologija",
    name: "Dermatološki pregled",
    description: "Dermoskopija mladeža, pregled kože i dijagnostika",
    duration_minutes: 30,
    price: 0,
    icon: "Search",
  },
  {
    id: "laserski-tretman",
    category: "dermatologija",
    name: "Laserski tretman",
    description: "Tretman pigmentacija, kapilara i podmlađivanje kože",
    duration_minutes: 45,
    price: 0,
    icon: "Zap",
  },
];

export const DEMO_DOCTOR = {
  id: "dr-marija",
  name: "Dr Marija Petrović",
  title: "Specijalista dermatovenerologije",
  services: DEMO_SERVICES.map((s) => s.id),
};

export const DEMO_WORKING_HOURS = [
  { days: "Ponedeljak–Petak", hours: "09:00–19:00" },
  { days: "Subota", hours: "10:00–14:00" },
  { days: "Nedelja", hours: null as string | null },
];
