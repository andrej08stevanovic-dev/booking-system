import Link from "next/link";
import {
  DEMO_CLINIC,
  DEMO_CATEGORIES,
  DEMO_SERVICES,
  DEMO_DOCTOR,
  DEMO_WORKING_HOURS,
} from "@/config/demo-data";
import type { Service } from "@/features/booking/types";
import { getServiceIcon } from "@/config/service-icons";

function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export default function Home() {
  const services: Service[] = DEMO_SERVICES;
  const servicesByCategory = DEMO_CATEGORIES.map((cat) => ({
    ...cat,
    items: services.filter((s) => s.category === cat.id),
  }));

  return (
    <main className="px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        {/* Hero */}
        <header className="mb-10 text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
            Ordinacija estetske medicine · Vranje
          </span>
          <h1 className="mt-2 font-[family-name:var(--font-heading)] text-5xl font-semibold tracking-[-0.02em] sm:text-6xl">
            {DEMO_CLINIC.name}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[var(--color-charcoal)]/70">
            Zakažite termin online — bez poziva, dostupno 24/7
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <Link
              href="/zakazivanje"
              className="btn-press rounded-xl bg-[var(--color-terracotta)] px-8 py-3.5 font-medium text-white shadow-[var(--shadow-md)] hover:opacity-90"
            >
              Zakažite termin
            </Link>
            <Link
              href="/prijava"
              className="border-b border-transparent text-sm font-medium text-[var(--color-charcoal)]/70 transition hover:border-[var(--color-terracotta)] hover:text-[var(--color-terracotta)]"
            >
              Moji termini
            </Link>
          </div>

          {/* Radno vreme */}
          <div className="mt-8 rounded-2xl bg-white/60 p-5 shadow-[var(--shadow-md)] ring-1 ring-[var(--color-beige)]">
            <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-terracotta)]">
              Radno vreme
            </h2>
            <dl className="flex flex-col gap-1 text-sm">
              {DEMO_WORKING_HOURS.map((row) => (
                <div key={row.days} className="flex items-center justify-between gap-4">
                  <dt className="text-[var(--color-charcoal)]/70">{row.days}</dt>
                  <dd
                    className={
                      row.hours === null
                        ? "font-medium text-[#b0574a]"
                        : "font-medium tabular-nums"
                    }
                  >
                    {row.hours ?? "Zatvoreno"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <div className="flex flex-col gap-12">
          {/* Usluge po kategoriji */}
          <section>
            <h2 className="mb-4 font-[family-name:var(--font-heading)] text-2xl font-semibold">
              Usluge
            </h2>
            <div className="flex flex-col gap-8">
              {servicesByCategory.map((cat) => (
                <ServiceGroup key={cat.id} title={cat.label} items={cat.items} />
              ))}
            </div>
          </section>

          {/* Tim */}
          <section>
            <h2 className="mb-4 font-[family-name:var(--font-heading)] text-2xl font-semibold">
              Naš tim
            </h2>
            <div className="rounded-2xl bg-white/60 p-5 shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-beige)]">
              <h3 className="text-lg font-semibold">{DEMO_DOCTOR.name}</h3>
              <p className="text-sm text-[var(--color-charcoal)]/60">
                {DEMO_DOCTOR.title}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {DEMO_SERVICES.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full bg-[var(--color-terracotta)]/8 px-3 py-1 text-[13px] text-[var(--color-charcoal)]/80"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ServiceGroup({ title, items }: { title: string; items: Service[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-terracotta)]">
        {title}
      </h3>
      <ul className="overflow-hidden rounded-xl ring-1 ring-[var(--color-beige)]">
        {items.map((s, i) => {
          const Icon = getServiceIcon(s.icon);
          return (
            <li
              key={s.id}
              className={`flex items-start gap-4 bg-white/60 px-5 py-4 ${
                i > 0 ? "border-t border-[var(--color-beige)]" : ""
              }`}
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-medium">{s.name}</p>
                {s.description && (
                  <p className="mt-0.5 text-sm text-[var(--color-charcoal)]/60">
                    {s.description}
                  </p>
                )}
                <p className="mt-1 text-sm text-[var(--color-charcoal)]/50">
                  {formatDuration(s.duration_minutes)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
