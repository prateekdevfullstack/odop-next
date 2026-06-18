import { useEffect, type RefObject } from "react";
import type { MotionValue } from "framer-motion";

type LabelAnchor = "start" | "middle" | "end";

interface WheelRotationConfig<T extends { mid: number }> {
  cx: number;
  cy: number;
  segments: readonly T[];
  badgePos: (mid: number, r: number) => { x: number; y: number };
  labelPos: (seg: T, r: number) => { tx: number; ty: number; anchor: LabelAnchor };
}

/** Batches SVG wheel updates on rAF and uses CSS transforms for GPU compositing. */
export function useWheelRotation<T extends { mid: number }>(
  rotation: MotionValue<number>,
  groupRef: RefObject<SVGGElement | null>,
  badgeRefs: RefObject<(SVGGElement | null)[]>,
  labelGroupRefs: RefObject<(SVGGElement | null)[]>,
  labelTextRefs: RefObject<(SVGTextElement | null)[]>,
  config: WheelRotationConfig<T>,
) {
  const { cx, cy, segments, badgePos, labelPos } = config;

  useEffect(() => {
    let rafId = 0;
    let pendingR: number | null = null;

    const applyNow = (r: number) => {
      const group = groupRef.current;
      if (group) {
        group.style.transform = `rotate(${r}deg)`;
        group.style.transformOrigin = `${cx}px ${cy}px`;
        group.style.willChange = "transform";
      }

      segments.forEach((seg, i) => {
        const { x: bx, y: by } = badgePos(seg.mid, r);
        const badge = badgeRefs.current?.[i];
        if (badge) {
          badge.style.transform = `translate(${bx}px, ${by}px)`;
          badge.style.willChange = "transform";
        }

        const { tx, ty, anchor } = labelPos(seg, r);
        const labelGroup = labelGroupRefs.current?.[i];
        if (labelGroup) {
          labelGroup.style.transform = `translate(${tx}px, ${ty}px)`;
          labelGroup.style.willChange = "transform";
        }

        const textEl = labelTextRefs.current?.[i];
        if (textEl && textEl.getAttribute("text-anchor") !== anchor) {
          textEl.setAttribute("text-anchor", anchor);
        }
      });
    };

    const scheduleApply = (r: number) => {
      pendingR = r;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (pendingR !== null) applyNow(pendingR);
      });
    };

    scheduleApply(rotation.get());
    const unsubscribe = rotation.on("change", scheduleApply);

    return () => {
      unsubscribe();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [rotation, groupRef, badgeRefs, labelGroupRefs, labelTextRefs, cx, cy, segments, badgePos, labelPos]);
}

/** Throttles featured-segment detection during continuous spin (mobile GPUs). */
export function useFeaturedSegmentSync<T extends string>(
  rotation: MotionValue<number>,
  isSnapAnimatingRef: RefObject<boolean>,
  getFeaturedId: (rotationValue: number) => T,
  setActiveSegment: (id: T) => void,
) {
  useEffect(() => {
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches;
    const minInterval = isMobile ? 120 : 0;
    let lastCheck = 0;

    return rotation.on("change", (latest) => {
      if (isSnapAnimatingRef.current) return;

      if (minInterval > 0) {
        const now = performance.now();
        if (now - lastCheck < minInterval) return;
        lastCheck = now;
      }

      setActiveSegment(getFeaturedId(latest));
    });
  }, [rotation, isSnapAnimatingRef, getFeaturedId, setActiveSegment]);
}
