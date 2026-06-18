"use client";

import { Toaster } from "sonner";

/**
 * Global toast host. Renders above modals (see `.modal-overlay` in globals.css).
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      style={{ zIndex: 10200 }}
    />
  );
}
