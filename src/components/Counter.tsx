"use client";

import { useEffect, useRef, useState } from "react";

export default function Counter({
  value,
  duration = 1800,
}: {
  value: string; // "1,000+", "₹7,000 Cr+"
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/(\d[\d,]*(?:\.\d+)?)/);
    if (!match) return;

    const numericText = match[0];
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + numericText.length);
    const decimals = numericText.includes(".") ? numericText.split(".")[1].length : 0;
    const target = Number(numericText.replace(/,/g, ""));
    if (isNaN(target)) return;

    let hasAnimated = false;
    const formatValue = (current: number) =>
      `${prefix}${current.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;

          const startTime = performance.now();

          const update = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            const current = decimals > 0 ? eased * target : Math.floor(eased * target);
            setDisplay(formatValue(current));

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setDisplay(value);
            }
          };

          requestAnimationFrame(update);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}
