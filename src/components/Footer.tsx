import Link from "next/link";
import { DEMO_CLINIC, DEMO_WORKING_HOURS } from "@/config/demo-data";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--color-dark)] text-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="font-[family-name:var(--font-heading)] text-xl font-bold">
              {DEMO_CLINIC.name}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {DEMO_CLINIC.tagline} · {DEMO_CLINIC.city}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-white/50">
              Radno vreme
            </h3>
            <dl className="mt-2 flex flex-col gap-1 text-sm">
              {DEMO_WORKING_HOURS.map((row) => (
                <div key={row.days} className="flex justify-between gap-6">
                  <dt className="text-white/70">{row.days}</dt>
                  <dd className="tabular-nums text-white/90">
                    {row.hours ?? "Zatvoreno"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-white/50">
              Brzi linkovi
            </h3>
            <nav className="mt-2 flex flex-col gap-1 text-sm">
              <Link href="/zakazivanje" className="text-white/70 transition hover:text-white">
                Zakažite termin
              </Link>
              <Link href="/prijava" className="text-white/70 transition hover:text-white">
                Moji termini
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-[13px] text-white/50">
          <span>
            © {new Date().getFullYear()} {DEMO_CLINIC.name} · {DEMO_CLINIC.city}
          </span>
          <Link href="/recepcija/login" className="transition hover:text-white">
            Ulaz za osoblje
          </Link>
        </div>
      </div>
    </footer>
  );
}
