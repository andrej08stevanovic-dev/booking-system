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
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-sage)] text-[13px] font-bold text-white">
            {initials}
          </span>
          <span className="whitespace-nowrap font-[family-name:var(--font-heading)] text-base font-bold tracking-[-0.01em] sm:text-lg">
            {DEMO_CLINIC.name}
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium sm:gap-4">
          <Link
            href="/prijava"
            className="whitespace-nowrap border-b-2 border-transparent pb-0.5 text-[var(--color-charcoal)]/80 transition hover:border-[var(--color-terracotta)] hover:text-[var(--color-terracotta)]"
          >
            Moji termini
          </Link>
          <Link
            href="/zakazivanje"
            className="btn-press whitespace-nowrap rounded-full bg-[var(--color-terracotta)] px-3.5 py-2 text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)] sm:px-4"
          >
            Zakažite<span className="hidden sm:inline"> termin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
