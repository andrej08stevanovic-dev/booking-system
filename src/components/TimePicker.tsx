"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "./useOutsideClick";
import { useAnchoredPopover } from "./useAnchoredPopover";

type Props = {
  value: string; // "" ili "HH:mm"
  onChange: (timeStr: string) => void;
  startMinutes?: number; // podrazumevano 07:00
  endMinutes?: number; // podrazumevano 22:00
  stepMinutes?: number; // podrazumevano 15
  placeholder?: string;
  isSlotDisabled?: (timeStr: string) => boolean;
};

function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function TimePicker({
  value,
  onChange,
  startMinutes = 7 * 60,
  endMinutes = 22 * 60,
  stepMinutes = 15,
  placeholder = "Izaberi vreme",
  isSlotDisabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Portal (createPortal) zahteva document.body — samo posle mount-a na klijentu.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Portal u body + fixed usidren na triger — isti razlog kao u DatePicker-u:
  // popover mora da lebdi iznad svega i van skrolabilnog/animiranog pretka.
  const { popoverRef, style: popoverStyle } = useAnchoredPopover(wrapperRef, open);

  useOutsideClick([wrapperRef, popoverRef], open, () => setOpen(false));

  useEffect(() => {
    if (open) selectedRef.current?.scrollIntoView({ block: "center" });
  }, [open]);

  const options = useMemo(() => {
    const list: string[] = [];
    for (let m = startMinutes; m <= endMinutes; m += stepMinutes) {
      list.push(formatMinutes(m));
    }
    return list;
  }, [startMinutes, endMinutes, stepMinutes]);

  function pick(t: string) {
    onChange(t);
    setOpen(false);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-xl border border-[var(--color-beige)] bg-white px-4 py-2.5 text-left text-[var(--color-charcoal)] outline-none transition focus:ring-2 focus:ring-[var(--color-terracotta)]"
      >
        {value || <span className="text-[var(--color-charcoal)]/50">{placeholder}</span>}
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            ref={popoverRef}
            style={popoverStyle}
            className="z-[70] max-h-64 w-45 overflow-y-auto rounded-2xl bg-white p-2 shadow-xl ring-1 ring-[var(--color-beige)]"
          >
            <div className="grid grid-cols-2 gap-1">
            {options.map((t) => {
              const isSelected = t === value;
              const isDisabled = isSlotDisabled?.(t) ?? false;
              return (
                <button
                  key={t}
                  ref={isSelected ? selectedRef : undefined}
                  type="button"
                  onClick={() => !isDisabled && pick(t)}
                  disabled={isDisabled}
                  className={`rounded-full px-2 py-1.5 text-center text-sm tabular-nums transition ${
                    isSelected
                      ? "bg-[var(--color-terracotta)] font-medium text-white"
                      : isDisabled
                      ? "text-[var(--color-charcoal)]/30 line-through cursor-not-allowed opacity-50 hover:bg-transparent"
                      : "hover:bg-[var(--color-mint)]"
                  }`}
                >
                  {t}
                </button>
              );
            })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
