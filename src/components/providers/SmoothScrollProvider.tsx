// "use client";

// import { useEffect, useState } from "react";
// import { ReactLenis } from "lenis/react";
// import "lenis/dist/lenis.css";

// export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
//   const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
//     const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

//     updatePreference();
//     mediaQuery.addEventListener("change", updatePreference);

//     return () => {
//       mediaQuery.removeEventListener("change", updatePreference);
//     };
//   }, []);

//   if (prefersReducedMotion) {
//     return <>{children}</>;
//   }

//   return (
//     <ReactLenis
//       root
//       options={{
//         autoRaf: true,
//         duration: 1.15,
//         easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//         smoothWheel: true,
//         touchMultiplier: 1.05,
//         anchors: {
//           offset: -140,
//           duration: 1.1,
//         },
//       }}
//     >
//       {children}
//     </ReactLenis>
//   );
// }
