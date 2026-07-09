import Link from "next/link";
import {
  ArrowDown,
  CalendarClock,
  CalendarX2,
  CheckCircle2,
} from "lucide-react";
import {
  DEMO_CATEGORIES,
  DEMO_SERVICES,
  DEMO_DOCTOR,
} from "@/config/demo-data";
import type { Service } from "@/features/booking/types";
import { getServiceIcon } from "@/config/service-icons";
import { SiteHeader } from "@/components/SiteHeader";

function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

const TRUST_ITEMS = ["Potvrda odmah", "Bez naloga i lozinke", "Otkazivanje jednim klikom"];

const BENEFITS = [
  {
    icon: CalendarClock,
    title: "Dostupno 24/7",
    text: "Zakažite kad vama odgovara — i nedeljom u ponoć.",
  },
  {
    icon: CheckCircle2,
    title: "Potvrda odmah",
    text: "Termin je rezervisan istog trenutka, bez čekanja na poziv.",
  },
  {
    icon: CalendarX2,
    title: "Lako otkazivanje",
    text: "Sprečeni ste? Otkažite termin jednim klikom, bez objašnjavanja.",
  },
];

export default function Home() {
  const services: Service[] = DEMO_SERVICES;
  const servicesByCategory = DEMO_CATEGORIES.map((cat) => ({
    ...cat,
    items: services.filter((s) => s.category === cat.id),
  }));

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO — jedan ekran, jedna misao: naslov → CTA → dokaz (mockup).
            Levo poravnat na mobilnom (editorial), centriran na sm+.
            Elementi ulaze stagger animacijom (animate-rise + animationDelay). */}
        <section className="hero-glow px-5 pb-20 pt-16 sm:px-6 sm:pb-16 sm:pt-24">
          <div className="mx-auto w-full max-w-2xl sm:text-center">
            <h1 className="animate-rise font-[family-name:var(--font-display)] text-[44px] font-medium leading-[1.06] tracking-[-0.015em] sm:text-6xl">
              Vaš termin.
              <span className="block italic text-[var(--color-terracotta)]">
                Bez poziva i čekanja.
              </span>
            </h1>

            <div
              className="animate-rise mt-10 flex flex-col gap-5 sm:items-center"
              style={{ animationDelay: "120ms" }}
            >
              <Link
                href="/zakazivanje"
                className="btn-press w-full rounded-xl bg-[var(--color-terracotta)] px-8 py-4 text-center text-[17px] font-medium text-white shadow-[var(--shadow-md)] hover:bg-[var(--color-accent-hover)] sm:w-auto sm:text-base"
              >
                Zakažite termin
              </Link>
              <a
                href="#usluge"
                className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-[var(--color-charcoal)]/70 underline-offset-4 transition hover:text-[var(--color-terracotta)] hover:underline sm:self-center"
              >
                Pogledajte usluge
                <ArrowDown size={15} strokeWidth={2} />
              </a>
            </div>

            <p
              className="animate-rise mt-8 text-[13px] tracking-wide text-[var(--color-charcoal)]/55"
              style={{ animationDelay: "200ms" }}
            >
              {TRUST_ITEMS.join(" · ")}
            </p>

            {/* Mini-mockup potvrđenog termina — prodaje proizvod u prvoj sekundi.
                Rotacija stoji na omotaču, NE na .animate-float elementu:
                floatY keyframes prepisuju transform, pa bi rotate tamo nestao. */}
            <div
              className="animate-rise mt-14 flex justify-center sm:mt-16"
              style={{ animationDelay: "300ms" }}
            >
              <div className="w-full max-w-xs -rotate-2">
                <div
                  className="animate-float rounded-2xl bg-white p-5 text-left shadow-[var(--shadow-lg)] ring-1 ring-[var(--color-beige)]"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-sage)]/12 text-[var(--color-sage)]">
                      <CheckCircle2 size={22} strokeWidth={2} />
                    </span>
                    <div>
                      <p className="font-semibold leading-tight">Termin potvrđen</p>
                      <p className="text-[13px] text-[var(--color-charcoal)]/55">upravo sada</p>
                    </div>
                  </div>
                  <div className="my-4 h-px bg-[var(--color-beige)]" />
                  <div className="flex flex-col gap-1.5 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-[var(--color-charcoal)]/55">Usluga</span>
                      <span className="font-medium">Botoks</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[var(--color-charcoal)]/55">Doktor</span>
                      <span className="font-medium">{DEMO_DOCTOR.name}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[var(--color-charcoal)]/55">Vreme</span>
                      <span className="font-medium">petak u 10:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITI */}
        <section className="px-4 py-16 sm:px-6 sm:py-14">
          <div className="mx-auto grid w-full max-w-3xl gap-8 sm:grid-cols-3 sm:gap-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl p-2 text-center sm:p-4">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]">
                  <b.icon size={22} strokeWidth={1.75} />
                </span>
                <h3 className="mt-3 font-semibold">{b.title}</h3>
                <p className="mx-auto mt-1 max-w-[26ch] text-sm text-[var(--color-charcoal)]/60">
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* USLUGE — mint pozadina razbija belu monotoniju */}
        <section id="usluge" className="bg-[var(--color-mint)] px-4 py-16 sm:px-6 sm:py-14">
          <div className="mx-auto w-full max-w-3xl">
            <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-medium">
              Usluge
            </h2>
            <p className="mx-auto mt-2 max-w-md text-center text-[var(--color-charcoal)]/60">
              Svaki tretman počinje razgovorom — prva konsultacija je uvek
              prvi korak.
            </p>
            <div className="mt-8 flex flex-col gap-10">
              {servicesByCategory.map((cat) => (
                <ServiceGroup key={cat.id} title={cat.label} items={cat.items} />
              ))}
            </div>
          </div>
        </section>

        {/* TIM */}
        <section className="px-4 py-16 sm:px-6 sm:py-14">
          <div className="mx-auto w-full max-w-3xl">
            <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-medium">
              Naš tim
            </h2>
            <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-white p-6 shadow-[var(--shadow-md)] ring-1 ring-[var(--color-beige)]">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-sage)] font-[family-name:var(--font-heading)] text-xl font-bold text-white">
                  {DEMO_DOCTOR.name
                    .replace(/^Dr\s+/i, "")
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{DEMO_DOCTOR.name}</h3>
                  <p className="text-sm text-[var(--color-charcoal)]/60">
                    {DEMO_DOCTOR.title}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {DEMO_CATEGORIES.map((c) => (
                  <span
                    key={c.id}
                    className="rounded-full bg-[var(--color-terracotta)]/8 px-3 py-1 text-[13px] font-medium text-[var(--color-terracotta)]"
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TAMNA CTA TRAKA — pred footer */}
        <section className="bg-[var(--color-dark)] px-4 py-16 text-center text-white sm:px-6 sm:py-14">
          <div className="mx-auto w-full max-w-xl">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium">
              Spremni za prvi korak?
            </h2>
            <p className="mt-2 text-white/70">
              Zakazivanje traje manje od 60 sekundi — bez naloga i bez poziva.
            </p>
            <Link
              href="/zakazivanje"
              className="btn-press mt-6 inline-block rounded-xl bg-white px-8 py-3.5 font-medium text-[var(--color-dark)] shadow-[var(--shadow-md)] hover:bg-white/90"
            >
              Zakažite termin
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function ServiceGroup({ title, items }: { title: string; items: Service[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-terracotta)]">
        {title}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((s) => {
          const Icon = getServiceIcon(s.icon);
          return (
            <div
              key={s.id}
              className="card-interactive flex items-start gap-4 rounded-2xl bg-white p-5 shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-beige)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-semibold">{s.name}</p>
                {s.description && (
                  <p className="mt-0.5 text-sm leading-relaxed text-[var(--color-charcoal)]/60">
                    {s.description}
                  </p>
                )}
                <p className="mt-2 inline-block rounded-full bg-[var(--color-mint-strong)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-charcoal)]/70">
                  {formatDuration(s.duration_minutes)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
