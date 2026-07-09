import {
  Stethoscope,
  Sparkles,
  Syringe,
  Droplets,
  Flower2,
  HeartPulse,
  Search,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Beli spisak — svaka ikonica iz DEMO_SERVICES mora biti ovde (provereno da
// sva imena postoje u lucide-react pre uvoza).
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Stethoscope,
  Sparkles,
  Syringe,
  Droplets,
  Flower2,
  HeartPulse,
  Search,
  Zap,
};

export function getServiceIcon(iconName?: string): LucideIcon {
  return (iconName && SERVICE_ICONS[iconName]) || Sparkles;
}
