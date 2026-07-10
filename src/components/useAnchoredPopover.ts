"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

// Zašto postoji: popover (kalendar / lista vremena) mora da lebdi IZNAD svega,
// ali sekcije u toku zakazivanja imaju CSS animaciju sa transform-om + fill:both,
// pa svaka postaje zaseban "stacking context". Popover renderovan kao
// position:absolute unutar takve sekcije ostaje ZAROBLJEN u njoj — ne može preko
// kasnijih sekcija ni preko sticky trake. Rešenje: portal u document.body +
// position:fixed usidren na triger. Ovaj hook računa fixed koordinate.
//
// Vraća ref koji se kači na portalovani popover (za merenje) i style sa
// koordinatama. Popover je skriven (visibility:hidden) dok se ne izmeri i ne
// pozicionira — bez skoka na ekranu.

type PopoverStyle = {
  position: "fixed";
  top: number;
  left: number;
  visibility: "hidden" | "visible";
};

export function useAnchoredPopover(
  triggerRef: React.RefObject<HTMLElement | null>,
  open: boolean,
  { gap = 8, margin = 8 }: { gap?: number; margin?: number } = {}
) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<PopoverStyle>({
    position: "fixed",
    top: 0,
    left: 0,
    visibility: "hidden",
  });

  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    const popover = popoverRef.current;
    if (!trigger || !popover) return;

    const t = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = popover.offsetWidth;
    const ph = popover.offsetHeight;

    // Vertikala: podrazumevano ispod trigera. Ako nema mesta ispod a ima gore,
    // preokreni naviše (npr. triger nisko na ekranu). Na kraju zategni u viewport.
    const spaceBelow = vh - t.bottom;
    const spaceAbove = t.top;
    let top =
      spaceBelow >= ph + gap + margin || spaceBelow >= spaceAbove
        ? t.bottom + gap
        : t.top - gap - ph;
    top = Math.max(margin, Math.min(top, vh - ph - margin));

    // Horizontala: poravnaj levu ivicu sa trigerom, pa zategni u viewport.
    let left = t.left;
    left = Math.min(left, vw - pw - margin);
    left = Math.max(margin, left);

    setStyle({ position: "fixed", top, left, visibility: "visible" });
  }, [triggerRef, gap, margin]);

  useLayoutEffect(() => {
    if (!open) {
      // Sinhroni setState je namera: sinhronizacija sa DOM merenjem, ne izvedeno stanje.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStyle((s) => (s.visibility === "hidden" ? s : { ...s, visibility: "hidden" }));
      return;
    }
    reposition();
    // Drugi prolaz posle paint-a: hvata konačnu visinu (fontovi, sadržaj) pre
    // nego što postane vidljiv.
    const raf = requestAnimationFrame(reposition);
    // capture:true da uhvati skrol i unutar skrolabilnih kontejnera (modal, itd).
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, reposition]);

  return { popoverRef, style };
}
