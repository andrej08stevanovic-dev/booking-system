import Link from "next/link";
import { DEMO_CLINIC } from "@/config/demo-data";

// Inicijali za logo-znak ("Derma Nova" -> "DN").
const initials = DEMO_CLINIC.name
  .split(" ")
  .map((w) => w[0])
  .join("")
  .toUpperCase();

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-beige)] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-sage)] text-[13px] font-bold text-white">
            {initials}
          </span>
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-[-0.01em]">
            {DEMO_CLINIC.name}
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/prijava"
            className="border-b-2 border-transparent pb-0.5 text-[var(--color-charcoal)]/80 transition hover:border-[var(--color-terracotta)] hover:text-[var(--color-terracotta)]"
          >
            Moji termini
          </Link>
          <Link
            href="/zakazivanje"
            className="btn-press rounded-full bg-[var(--color-terracotta)] px-4 py-2 text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]"
          >
            Zakažite termin
          </Link>
        </nav>
      </div>
    </header>
  );
}
