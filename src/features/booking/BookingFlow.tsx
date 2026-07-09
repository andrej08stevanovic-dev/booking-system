"use client";

import { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { DateTime } from "luxon";
import { DatePicker } from "@/components/DatePicker";
import { DEMO_CATEGORIES, DEMO_CLINIC } from "@/config/demo-data";
import { getServiceIcon } from "@/config/service-icons";
import type { MergedSlot, Service, StaffMember } from "./types";
import { computeDemoSlots } from "./demo-availability";
import type { Slot } from "./availability";

type Props = {
  services: Service[];
  staff: StaffMember[];
  links: { staff_id: string; service_id: string }[];
  timezone: string;
  maxHorizonDays: number;
};

type Screen = "picker" | "review" | "success";
type SelectedSlot = { startUtcISO: string; label: string };
// Dodela prati NAMERU mušterije, ne trenutni broj slobodnih:
//  - 'specific': kliknula konkretno ime radnika (korak 2)
//  - 'any': izabrala "Bilo ko slobodan" — sistem NIKAD ne pita kod koga;
//    server dodeljuje konkretnog radnika tek pri potvrdi.
type Assignment = { origin: "specific"; staffId: string; staffName: string } | { origin: "any" } | null;

function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

function formatDate(dateStr: string) {
  const d = DateTime.fromISO(dateStr);
  return d.isValid ? d.toFormat("dd.MM.yyyy.") : dateStr;
}

export function BookingFlow({
  services,
  staff,
  links,
  timezone,
  maxHorizonDays,
}: Props) {
  const [screen, setScreen] = useState<Screen>("picker");

  const [service, setService] = useState<Service | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null); // konkretan izbor
  const [anyMode, setAnyMode] = useState(false); // "Bilo ko slobodan"
  const [date, setDate] = useState<string>("");

  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [assignment, setAssignment] = useState<Assignment>(null);
  const [confirmedStaffName, setConfirmedStaffName] = useState<string | null>(null);
  const [confirmedWasAny, setConfirmedWasAny] = useState(false);

  // Podaci mušterije
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const staffSectionRef = useRef<HTMLElement>(null);
  const dateSectionRef = useRef<HTMLElement>(null);
  const slotsSectionRef = useRef<HTMLElement>(null);
  const customerSectionRef = useRef<HTMLElement>(null);

  // Gladak skrol do sledećeg koraka. Odlaganje: sekcija se tek pojavljuje
  // (uslovni render), pa mora prvo da se nacrta da bi skrol imao metu.
  // Sekcija se CENTRIRA na ekranu; ako je viša od ekrana, poravna se odmah
  // ispod sticky hedera — nikad block:"start" koji je gurao korak na sam vrh.
  function scrollToStep(ref: React.RefObject<HTMLElement | null>) {
    setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const headerOffset = 88;
      const rect = el.getBoundingClientRect();
      const offset = Math.max((window.innerHeight - rect.height) / 2, headerOffset);
      window.scrollTo({
        top: rect.top + window.scrollY - offset,
        behavior: "smooth",
      });
    }, 100);
  }

  // Granice date inputa u beogradskoj zoni (UX; server svejedno reproverava).
  const todayISO = useMemo(
    () => DateTime.now().setZone(timezone).toISODate()!,
    [timezone]
  );
  const maxISO = useMemo(
    () =>
      DateTime.now().setZone(timezone).plus({ days: maxHorizonDays }).toISODate()!,
    [timezone, maxHorizonDays]
  );

  const servicesByCategory = DEMO_CATEGORIES.map((cat) => ({
    ...cat,
    items: services.filter((s) => s.category === cat.id),
  }));

  const concreteStaffName = staff.find((s) => s.id === staffId)?.full_name ?? "";

  // Radnici koji rade IZABRANU uslugu.
  const availableStaff = useMemo(() => {
    if (!service) return [];
    const ids = new Set(
      links.filter((l) => l.service_id === service.id).map((l) => l.staff_id)
    );
    return staff.filter((s) => ids.has(s.id));
  }, [service, links, staff]);

  const hasStaffPick = staffId !== null || anyMode;

  // Termini — KONKRETAN radnik. Demo: čisto sinhrono lokalno računanje (vidi
  // ./demo-availability.ts), bez baze — pa se izvodi kao derivirana vrednost
  // (useMemo), ne kao efekat sa setState.
  const specificResult = useMemo(() => {
    if (anyMode || !service || !staffId || !date) return null;
    return computeDemoSlots(date, service.duration_minutes);
  }, [anyMode, service, staffId, date]);

  // Termini — "BILO KO" (spojeno). Isti generator; svi trenutno izabrani
  // radnici prikazani kao slobodni na svakom terminu.
  const anyResult = useMemo(() => {
    if (!anyMode || !service || !date) return null;
    return computeDemoSlots(date, service.duration_minutes);
  }, [anyMode, service, date]);

  const slots: Slot[] = specificResult?.slots ?? [];
  const anySlots: MergedSlot[] = useMemo(() => {
    if (!anyResult) return [];
    return anyResult.slots.map((slot) => ({
      startUtcISO: slot.startUtcISO,
      label: slot.label,
      freeStaff: staff.map((m) => ({ id: m.id, ime: m.full_name })),
    }));
  }, [anyResult, staff]);
  const outOfRange = (anyMode ? anyResult?.outOfRange : specificResult?.outOfRange) ?? false;
  const loaded = anyMode ? anyResult !== null : specificResult !== null;

  function resetSelectionState() {
    setDate("");
    setSelectedSlot(null);
    setAssignment(null);
  }

  function chooseService(s: Service) {
    setService(s);
    setStaffId(null);
    setAnyMode(false);
    resetSelectionState();
    scrollToStep(staffSectionRef);
  }

  function chooseConcreteStaff(id: string) {
    setStaffId(id);
    setAnyMode(false);
    resetSelectionState();
    scrollToStep(dateSectionRef);
  }

  function chooseAny() {
    setAnyMode(true);
    setStaffId(null);
    resetSelectionState();
    scrollToStep(dateSectionRef);
  }

  function onDateChange(value: string) {
    setDate(value);
    setSelectedSlot(null);
    setAssignment(null);
    if (value) scrollToStep(slotsSectionRef);
  }

  // Izbor vremena — konkretan radnik.
  function pickSpecificTime(slot: Slot) {
    setSelectedSlot({ startUtcISO: slot.startUtcISO, label: slot.label });
    setAssignment({
      origin: "specific",
      staffId: staffId!,
      staffName: concreteStaffName,
    });
    scrollToStep(customerSectionRef);
  }

  // Izbor vremena — "bilo ko". Sistem NIKAD ne pita kod koga; dodela ide
  // pri potvrdi, server-side.
  function pickAnyTime(m: MergedSlot) {
    setSelectedSlot({ startUtcISO: m.startUtcISO, label: m.label });
    setAssignment({ origin: "any" });
    scrollToStep(customerSectionRef);
  }

  function goToReview() {
    setFormError(null);
    if (!fullName.trim()) return setFormError("Unesite ime.");
    if (!phone.trim()) return setFormError("Unesite broj telefona.");
    if (email.trim() && !/.+@.+\..+/.test(email.trim())) {
      return setFormError("Email nije ispravan (ili ga ostavite prazno).");
    }
    setScreen("review");
  }

  // Demo: nema upisa u bazu (service_id iz demo podataka ne postoji u
  // Optiminoj šemi). Simuliramo mrežno kašnjenje pa prikazujemo uspeh.
  async function confirmBooking() {
    if (!service || !selectedSlot || !assignment) return;

    setSubmitting(true);
    setFormError(null);
    const staffName =
      assignment.origin === "specific"
        ? assignment.staffName
        : (staff[0]?.full_name ?? "");
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));
    setConfirmedStaffName(staffName);
    setConfirmedWasAny(assignment.origin === "any");
    setScreen("success");
    setSubmitting(false);
  }

  function resetAll() {
    setScreen("picker");
    setService(null);
    setStaffId(null);
    setAnyMode(false);
    resetSelectionState();
    setFullName("");
    setPhone("");
    setEmail("");
    setFormError(null);
    setConfirmedStaffName(null);
    setConfirmedWasAny(false);
  }

  const cardBase =
    "card-interactive relative w-full rounded-xl bg-white/60 p-4 text-left shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-beige)] hover:ring-[var(--color-terracotta)]";
  const cardActive = "ring-2 ring-[var(--color-terracotta)] bg-[var(--color-terracotta)]/8";
  const inputBase =
    "w-full rounded-xl border border-[var(--color-beige)] bg-white/60 px-4 py-3 text-base text-[var(--color-charcoal)] outline-none transition focus:border-[var(--color-terracotta)] focus:ring-[3px] focus:ring-[var(--color-terracotta)]/15";

  const staffLineForReview =
    assignment?.origin === "specific"
      ? assignment.staffName
      : assignment?.origin === "any"
        ? "Dodeljujemo vam slobodnog doktora"
        : "";

  // ---------------- EKRAN USPEHA ----------------
  if (screen === "success" && service && selectedSlot) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-[var(--shadow-md)] ring-1 ring-[var(--color-beige)]">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          className="mx-auto mb-4 text-[#059669]"
          aria-hidden="true"
        >
          <circle
            cx="32"
            cy="32"
            r="30"
            stroke="currentColor"
            strokeWidth="2"
            style={{ transformOrigin: "center", animation: "checkmarkCircleGrow 0.4s var(--ease-out-expo) both" }}
          />
          <path
            d="M20 32 L28 40 L44 24"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 48,
              strokeDashoffset: 48,
              animation: "checkmarkDraw 0.5s var(--ease-out-expo) 0.3s both",
            }}
          />
        </svg>
        <h2
          className="font-[family-name:var(--font-heading)] text-3xl font-semibold"
          style={{ animation: "fadeIn var(--duration-normal) var(--ease-out-expo) 0.5s both" }}
        >
          Vaš termin je zakazan!
        </h2>
        <p
          className="mt-2 text-[var(--color-charcoal)]/70"
          style={{ animation: "fadeIn var(--duration-normal) var(--ease-out-expo) 0.6s both" }}
        >
          Vidimo se u ordinaciji {DEMO_CLINIC.name}.
        </p>

        {confirmedWasAny && confirmedStaffName && (
          <p
            className="mt-3 font-medium text-[var(--color-terracotta)]"
            style={{ animation: "fadeIn var(--duration-normal) var(--ease-out-expo) 0.65s both" }}
          >
            Vaš termin je kod {confirmedStaffName}.
          </p>
        )}

        <div
          className="mt-6 rounded-xl bg-[var(--color-mint)] p-5 text-left"
          style={{ animation: "fadeIn var(--duration-normal) var(--ease-out-expo) 0.7s both" }}
        >
          <Row label="Usluga" value={service.name} />
          <Row label="Doktor" value={confirmedStaffName ?? ""} />
          <Row
            label="Datum i vreme"
            value={`${formatDate(date)} u ${selectedSlot.label}`}
          />
          <Row label="Trajanje" value={formatDuration(service.duration_minutes)} />
          <Row label="Ime" value={fullName.trim()} />
          <Row label="Telefon" value={phone.trim()} />
          {email.trim() && <Row label="Email" value={email.trim()} />}
        </div>

        <div style={{ animation: "fadeIn var(--duration-normal) var(--ease-out-expo) 0.9s both" }}>
          <button
            type="button"
            onClick={resetAll}
            className="btn-press mt-6 w-full rounded-xl bg-[var(--color-terracotta)] px-6 py-3 font-medium text-white shadow-[var(--shadow-sm)] hover:opacity-90"
          >
            Zakažite još jedan termin
          </button>

          <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row">
            <Link
              href="/"
              className="btn-press flex-1 rounded-xl border border-[var(--color-beige)] px-6 py-3 text-center font-medium text-[var(--color-charcoal)] hover:bg-[var(--color-mint)]"
            >
              Nazad na početnu
            </Link>
            <Link
              href="/prijava"
              className="btn-press flex-1 rounded-xl border border-[var(--color-beige)] px-6 py-3 text-center font-medium text-[var(--color-charcoal)] hover:bg-[var(--color-mint)]"
            >
              Pogledajte svoje termine
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- EKRAN PREGLEDA ----------------
  if (screen === "review" && service && selectedSlot && assignment) {
    return (
      <div className="flex flex-col gap-6 animate-slide-right">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">
          Pregled rezervacije
        </h2>

        <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-md)] ring-1 ring-[var(--color-beige)]">
          <Row label="Usluga" value={service.name} />
          <Row label="Doktor" value={staffLineForReview} />
          <Row
            label="Datum i vreme"
            value={`${formatDate(date)} u ${selectedSlot.label}`}
          />
          <Row label="Trajanje" value={formatDuration(service.duration_minutes)} />
          <div className="my-3 h-px bg-[var(--color-beige)]" />
          <Row label="Ime" value={fullName.trim()} />
          <Row label="Telefon" value={phone.trim()} />
          {email.trim() && <Row label="Email" value={email.trim()} />}
        </div>

        {formError && (
          <p className="rounded-xl bg-[#fdece8] px-5 py-4 text-[var(--color-terracotta)]">
            {formError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setScreen("picker")}
            disabled={submitting}
            className="btn-press rounded-xl border border-[var(--color-beige)] px-6 py-3 font-medium text-[var(--color-charcoal)] hover:bg-[var(--color-mint)] disabled:opacity-50"
          >
            Nazad
          </button>
          <button
            type="button"
            onClick={confirmBooking}
            disabled={submitting}
            className="btn-press flex-1 rounded-xl bg-[var(--color-terracotta)] px-6 py-3 font-medium text-white shadow-[var(--shadow-sm)] hover:opacity-90 disabled:opacity-60"
            style={submitting ? { animation: "pulseOpacity 1.5s ease-in-out infinite" } : undefined}
          >
            {submitting ? "Zakazujem…" : "Potvrdite"}
          </button>
        </div>
      </div>
    );
  }

  // ---------------- EKRAN IZBORA ----------------
  // Korak se izvodi iz stanja (jedna skrol-stranica, sekcije se progresivno otkrivaju).
  const currentStep = !service ? 1 : !hasStaffPick ? 2 : !date ? 3 : !selectedSlot ? 4 : 5;

  // Sticky rezime na dnu: raste kako mušterija bira; sklanja se čim je termin
  // izabran (tada je fokus na formi ispod — traka bi smetala tastaturi).
  const showSummaryBar = !!service && !selectedSlot;

  return (
    <div className={`flex flex-col gap-10 ${showSummaryBar ? "pb-20" : ""}`}>
      <ProgressBar current={currentStep} total={5} />

      {/* 1) USLUGA */}
      <section className="animate-fade-in">
        <StepTitle n={1} title="Izaberite uslugu" done={!!service} />
        <div className="flex flex-col gap-6">
          {servicesByCategory.map((cat) => (
            <ServiceGroup
              key={cat.id}
              title={cat.label}
              items={cat.items}
              selectedId={service?.id ?? null}
              onPick={chooseService}
            />
          ))}
        </div>
      </section>

      {/* 2) RADNIK */}
      {service && (
        <section ref={staffSectionRef} className="animate-slide-right">
          <StepTitle n={2} title="Izaberite doktora" done={hasStaffPick} />
          {availableStaff.length === 0 ? (
            <p className="rounded-xl bg-[var(--color-mint-strong)] px-5 py-4 text-[var(--color-charcoal)]/80">
              Trenutno nema doktora za ovu uslugu.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* "Bilo ko" ima smisla samo kad ima >1 radnika za uslugu. */}
              {availableStaff.length > 1 && (
                <button
                  type="button"
                  onClick={chooseAny}
                  className={`${cardBase} ${anyMode ? cardActive : ""} sm:col-span-2`}
                >
                  {anyMode && <SelectedCheck />}
                  <span className="font-medium">Bilo ko slobodan</span>
                  <span className="mt-0.5 block text-sm italic text-[var(--color-charcoal)]/60">
                    Prikažite termine svih doktora za ovu uslugu
                  </span>
                </button>
              )}
              {availableStaff.map((m) => {
                const isSel = !anyMode && staffId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => chooseConcreteStaff(m.id)}
                    className={`${cardBase} ${isSel ? cardActive : ""}`}
                  >
                    {isSel && <SelectedCheck />}
                    <span className="font-medium">{m.full_name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 3) DATUM */}
      {service && hasStaffPick && (
        <section ref={dateSectionRef} className="animate-slide-right">
          <StepTitle n={3} title="Izaberite datum" done={!!date} />
          <DatePicker
            value={date}
            onChange={onDateChange}
            timezone={timezone}
            minDateISO={todayISO}
            maxDateISO={maxISO}
            placeholder="Izaberite datum"
          />
        </section>
      )}

      {/* 4) TERMINI */}
      {service && hasStaffPick && date && (
        <section ref={slotsSectionRef} className="animate-slide-right">
          <StepTitle n={4} title="Izaberite termin" done={!!selectedSlot} />

          {loaded && outOfRange && (
            <p className="rounded-xl bg-[var(--color-mint-strong)] px-5 py-4 text-[var(--color-charcoal)]/80">
              Datum je van perioda za zakazivanje.
            </p>
          )}

          {loaded &&
            !outOfRange &&
            (anyMode ? anySlots.length === 0 : slots.length === 0) && (
              <p className="rounded-xl bg-[var(--color-mint-strong)] px-5 py-4 text-[var(--color-charcoal)]/80">
                Nema slobodnih termina tog dana.
              </p>
            )}

          {/* Konkretan radnik */}
          {!anyMode && slots.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => (
                <TimeButton
                  key={slot.startUtcISO}
                  label={slot.label}
                  active={selectedSlot?.startUtcISO === slot.startUtcISO}
                  onClick={() => pickSpecificTime(slot)}
                />
              ))}
            </div>
          )}

          {/* "Bilo ko" — samo vremena; koga dobija se ne pita, dodela ide pri potvrdi */}
          {anyMode && anySlots.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {anySlots.map((m) => (
                <TimeButton
                  key={m.startUtcISO}
                  label={m.label}
                  active={selectedSlot?.startUtcISO === m.startUtcISO}
                  onClick={() => pickAnyTime(m)}
                />
              ))}
            </div>
          )}

          {selectedSlot && (
            <div className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--color-terracotta)] animate-pulse">
              <span>Izabran termin u {selectedSlot.label}. Popunite podatke ispod</span>
              <span className="text-base">↓</span>
            </div>
          )}
        </section>
      )}

      {/* PODACI MUŠTERIJE — kad je termin + dodela razrešena */}
      {selectedSlot && assignment && service && (
        <section ref={customerSectionRef} className="animate-slide-right">
          <StepTitle n={5} title="Vaši podaci" done={false} />
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-sm text-[var(--color-charcoal)]/70">
                Ime i prezime <span className="text-[var(--color-terracotta)]">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="npr. Jovana Petrović"
                className={inputBase}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[var(--color-charcoal)]/70">
                Telefon <span className="text-[var(--color-terracotta)]">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="npr. 064 123 4567"
                className={inputBase}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[var(--color-charcoal)]/70">
                Email (opciono)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="npr. jovana@primer.rs"
                className={inputBase}
              />
            </div>

            {formError && (
              <p className="rounded-xl bg-[#fdece8] px-5 py-4 text-[var(--color-terracotta)]">
                {formError}
              </p>
            )}

            <button
              type="button"
              onClick={goToReview}
              className="btn-press mt-2 rounded-xl bg-[var(--color-terracotta)] px-6 py-3 font-medium text-white shadow-[var(--shadow-sm)] hover:opacity-90"
            >
              Pregledajte termin
            </button>
          </div>
        </section>
      )}

      {/* STICKY REZIME — svaki klik ima vidljivu posledicu na dnu ekrana */}
      {showSummaryBar && service && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-4">
          <div className="animate-slide-up pointer-events-auto mx-auto flex w-full max-w-2xl items-center justify-between gap-3 rounded-2xl bg-[var(--color-dark)]/95 px-5 py-3 text-white shadow-[var(--shadow-lg)] backdrop-blur">
            <p className="truncate text-sm">
              <span className="font-medium">{service.name}</span>
              {hasStaffPick && (
                <span className="text-white/60">
                  {" "}
                  · {anyMode ? "Bilo ko slobodan" : concreteStaffName}
                </span>
              )}
              {date && <span className="text-white/60"> · {formatDate(date)}</span>}
            </p>
            <span className="shrink-0 text-xs font-medium text-white/50">
              Korak {currentStep}/5
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-press rounded-full px-3 py-2.5 text-center font-medium ring-1 ${
        active
          ? "bg-[var(--color-terracotta)] text-white ring-[var(--color-terracotta)] shadow-[var(--shadow-sm)]"
          : "bg-white ring-[var(--color-beige)] hover:bg-[var(--color-terracotta)]/8 hover:ring-[var(--color-terracotta)]"
      }`}
    >
      {label}
    </button>
  );
}

// Kružić sa ✓ u gornjem desnom uglu selektovane kartice — jasan signal izbora
// (ne oslanja se samo na ivicu, koja se lako previdi).
function SelectedCheck() {
  return (
    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-terracotta)] text-[11px] font-bold text-white">
      ✓
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <span className="text-sm text-[var(--color-charcoal)]/60">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

// Naslov koraka sa numerisanim kružićem: popunjen teal + ✓ kad je korak
// završen, obrub sa brojem dok je aktuelan.
function StepTitle({ n, title, done }: { n: number; title: string; done: boolean }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 font-[family-name:var(--font-heading)] text-2xl font-semibold">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
          done
            ? "bg-[var(--color-terracotta)] text-white"
            : "bg-white text-[var(--color-terracotta)] ring-2 ring-[var(--color-terracotta)]"
        }`}
      >
        {done ? <Check size={16} strokeWidth={3} /> : n}
      </span>
      {title}
    </h2>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-terracotta)]/12">
        <div
          className="h-full rounded-full bg-[var(--color-terracotta)]"
          style={{ width: `${pct}%`, transition: "width var(--duration-slow) var(--ease-out-expo)" }}
        />
      </div>
      <p className="mt-2 text-sm text-[var(--color-charcoal)]/60">
        Korak {current} od {total}
      </p>
    </div>
  );
}

function ServiceGroup({
  title,
  items,
  selectedId,
  onPick,
}: {
  title: string;
  items: Service[];
  selectedId: string | null;
  onPick: (s: Service) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-terracotta)]">
          {title}
        </h3>
        <div className="mt-1 h-px w-8 bg-[var(--color-terracotta)]" />
      </div>
      <div className="flex flex-col gap-2">
        {items.map((s) => {
          const isSel = selectedId === s.id;
          const Icon = getServiceIcon(s.icon);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onPick(s)}
              className={`card-interactive relative flex w-full items-center gap-4 rounded-xl bg-white/60 px-5 py-4 text-left shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-beige)] hover:ring-[var(--color-terracotta)] ${
                isSel ? "ring-2 ring-[var(--color-terracotta)] bg-[var(--color-terracotta)]/8" : ""
              }`}
            >
              {isSel && <SelectedCheck />}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <span className={isSel ? "pr-6" : ""}>
                <span className="block font-medium">{s.name}</span>
                <span className="block text-sm text-[var(--color-charcoal)]/60">
                  {formatDuration(s.duration_minutes)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
