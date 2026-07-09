import { DateTime } from "luxon";
import {
  computeAvailableSlots,
  type AvailabilityResult,
  type BusyInterval,
  type WorkingWindow,
} from "./availability";

// Demo zamena za actions.ts (koje čita bazu): isti čisti algoritam
// (computeAvailableSlots), ali radno vreme i "zauzeti" termini su fiksni/generisani
// lokalno — nema Supabase poziva. Vidi CLAUDE.md reskin plan, "Problem booking insert-a".

export const DEMO_TIMEZONE = "Europe/Belgrade";
export const DEMO_MAX_HORIZON_DAYS = 30;

const SLOT_INTERVAL_MINUTES = 15;
const MIN_LEAD_MINUTES = 30;

// Dan u nedelji IZ DATUMA (beogradska zona), po konvenciji 0=nedelja…6=subota
// (CLAUDE.md: JS getDay()/Postgres dow, NE sirov Luxon weekday).
function workingWindowsForDate(dateStr: string): WorkingWindow[] {
  const dow = DateTime.fromISO(dateStr, { zone: DEMO_TIMEZONE }).weekday % 7;
  if (dow === 0) return []; // nedelja — zatvoreno
  if (dow === 6) return [{ startTime: "10:00:00", endTime: "14:00:00" }]; // subota
  return [{ startTime: "09:00:00", endTime: "17:00:00" }]; // pon–pet
}

// Seed-ovan PRNG (po datumu) da "zauzeti" termini ne trepere iz rendera u render.
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(h, 31) + seed.charCodeAt(i)) >>> 0;
  return () => {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    return h / 0xffffffff;
  };
}

// 2-3 nasumična zauzeta bloka po danu, da lista termina izgleda realistično.
function demoBusyIntervals(dateStr: string): BusyInterval[] {
  const windows = workingWindowsForDate(dateStr);
  if (windows.length === 0) return [];

  const [sh, sm] = windows[0].startTime.split(":").map(Number);
  const [eh, em] = windows[0].endTime.split(":").map(Number);
  const base = DateTime.fromISO(dateStr, { zone: DEMO_TIMEZONE });
  const winStart = base.set({ hour: sh, minute: sm, second: 0, millisecond: 0 });
  const winEnd = base.set({ hour: eh, minute: em, second: 0, millisecond: 0 });
  const totalSlots = Math.floor(winEnd.diff(winStart, "minutes").minutes / SLOT_INTERVAL_MINUTES);
  if (totalSlots < 4) return [];

  const rand = seededRandom(dateStr);
  const count = 2 + Math.floor(rand() * 2); // 2 ili 3
  const busy: BusyInterval[] = [];
  for (let i = 0; i < count; i++) {
    const startOffset = Math.floor(rand() * (totalSlots - 2));
    const start = winStart.plus({ minutes: startOffset * SLOT_INTERVAL_MINUTES });
    const end = start.plus({ minutes: 30 });
    busy.push({ startUtcISO: start.toUTC().toISO()!, endUtcISO: end.toUTC().toISO()! });
  }
  return busy;
}

export function computeDemoSlots(
  dateStr: string,
  durationMinutes: number
): AvailabilityResult {
  return computeAvailableSlots({
    dateStr,
    durationMinutes,
    timezone: DEMO_TIMEZONE,
    slotIntervalMinutes: SLOT_INTERVAL_MINUTES,
    minLeadMinutes: MIN_LEAD_MINUTES,
    maxHorizonDays: DEMO_MAX_HORIZON_DAYS,
    workingWindows: workingWindowsForDate(dateStr),
    busy: demoBusyIntervals(dateStr),
  });
}
