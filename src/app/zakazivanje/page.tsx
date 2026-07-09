import Link from "next/link";
import { DEMO_SERVICES, DEMO_DOCTOR } from "@/config/demo-data";
import { DEMO_TIMEZONE, DEMO_MAX_HORIZON_DAYS } from "@/features/booking/demo-availability";
import { SiteHeader } from "@/components/SiteHeader";
import { BookingFlow } from "@/features/booking/BookingFlow";
import type { Service, StaffMember } from "@/features/booking/types";

export default function ZakazivanjePage() {
  const services: Service[] = DEMO_SERVICES;
  const staff: StaffMember[] = [{ id: DEMO_DOCTOR.id, full_name: DEMO_DOCTOR.name }];
  const links = DEMO_SERVICES.map((s) => ({
    staff_id: DEMO_DOCTOR.id,
    service_id: s.id,
  }));

  return (
    <>
      <SiteHeader />
      <main className="px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8 text-center">
          <Link
            href="/"
            className="text-sm text-[var(--color-terracotta)] hover:underline"
          >
            ← Tim i usluge
          </Link>
          <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold sm:text-4xl">
            Zakaži termin
          </h1>
          <p className="mt-2 text-[var(--color-charcoal)]/70">
            Izaberite uslugu, doktora i vreme.
          </p>
        </header>

        <BookingFlow
          services={services}
          staff={staff}
          links={links}
          timezone={DEMO_TIMEZONE}
          maxHorizonDays={DEMO_MAX_HORIZON_DAYS}
        />
      </div>
      </main>
    </>
  );
}
