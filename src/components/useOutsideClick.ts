"use client";

import { useEffect } from "react";

// Zatvara popover na klik van njega ili na Escape. Deljeno između DatePicker i
// TimePicker — identična logika, nema smisla duplirati.
//
// Prima jedan ref ILI listu refova: klik se smatra "spolja" samo ako je van SVIH
// datih elemenata. Bitno kad je popover portalovan u document.body (triger i
// popover su tada u različitim delovima DOM-a, pa oba moraju da se provere).
export function useOutsideClick(
  refs: React.RefObject<HTMLElement | null> | React.RefObject<HTMLElement | null>[],
  active: boolean,
  onOutside: () => void
) {
  useEffect(() => {
    if (!active) return;

    const list = Array.isArray(refs) ? refs : [refs];

    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      const inside = list.some((r) => r.current?.contains(target));
      if (!inside) onOutside();
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOutside();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, refs, onOutside]);
}
