"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CfcEventForm from "@/components/cfc/CfcEventForm";
import { ApiError } from "@/lib/api/types";
import { cfcPortalEventsPath } from "@/lib/cfc/routes";
import {
  buildCfcEventFormData,
  createCfcPortalEvent,
} from "@/services/cfc-portal.service";
import type { CfcEventFormState } from "@/components/cfc/CfcEventForm";

function apiErrorsToMap(errors?: Record<string, string[]>): Record<string, string> {
  if (!errors) return {};
  const out: Record<string, string> = {};
  for (const [key, arr] of Object.entries(errors)) {
    if (arr?.[0]) out[key] = arr[0];
  }
  return out;
}

export default function CfcPortalEventNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: CfcEventFormState, images: File[]) => {
    setIsSubmitting(true);
    setFieldErrors({});
    try {
      const formData = buildCfcEventFormData(values, images);
      await createCfcPortalEvent(formData);
      toast.success("Event created successfully.");
      router.push(cfcPortalEventsPath());
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        setFieldErrors(apiErrorsToMap(e.errors));
      }
      toast.error(e instanceof ApiError ? e.message : "Failed to create event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="cfc-portal-page-head">
        <h1>Add event</h1>
        <p>Upload event details and optional images.</p>
      </header>
      <div className="cfc-portal-panel">
        <CfcEventForm
          submitLabel="Create event"
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
          onCancel={() => router.push(cfcPortalEventsPath())}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
