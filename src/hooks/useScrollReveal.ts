"use client";

import { useEffect } from "react";

/** Re-observe `.reveal` elements when `deps` change (e.g. list re-rendered after search). */
export function useScrollReveal(deps: ReadonlyArray<unknown> = []) {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal:not(.visible)");

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller passes explicit deps
  }, deps);
}
