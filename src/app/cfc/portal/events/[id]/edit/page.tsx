"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CfcEventForm from "@/components/cfc/CfcEventForm";
import type { CfcEventFormState } from "@/components/cfc/CfcEventForm";
import { ApiError } from "@/lib/api/types";
import { cfcPortalEventsPath } from "@/lib/cfc/routes";
import {
  buildCfcEventFormData,
  deleteCfcPortalEventImage,
  getCfcPortalEvent,
  updateCfcPortalEvent,
} from "@/services/cfc-portal.service";
import type { CfcEvent } from "@/types/cfc-portal";

function apiErrorsToMap(errors?: Record<string, string[]>): Record<string, string> {
  if (!errors) return {};
  const out: Record<string, string> = {};
  for (const [key, arr] of Object.entries(errors)) {
    if (arr?.[0]) out[key] = arr[0];
  }
  return out;
}

export default function CfcPortalEventEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id ?? "");
  const [event, setEvent] = useState<CfcEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const data = await getCfcPortalEvent(id);
        if (!cancelled) setEvent(data);
      } catch (e) {
        if (!cancelled) {
          toast.error(e instanceof ApiError ? e.message : "Failed to load event.");
          router.push(cfcPortalEventsPath());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  const handleSubmit = async (values: CfcEventFormState, images: File[]) => {
    setIsSubmitting(true);
    setFieldErrors({});
    try {
      const formData = buildCfcEventFormData(values, images);
      await updateCfcPortalEvent(id, formData);
      toast.success("Event updated successfully.");
      router.push(cfcPortalEventsPath());
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        setFieldErrors(apiErrorsToMap(e.errors));
      }
      toast.error(e instanceof ApiError ? e.message : "Failed to update event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    await deleteCfcPortalEventImage(imageId);
    setEvent((prev) =>
      prev
        ? { ...prev, images: (prev.images ?? []).filter((img) => img.id !== imageId) }
        : prev
    );
    toast.success("Image removed.");
  };

  if (loading) return <div className="cfc-portal-loading">Loading event…</div>;
  if (!event) return null;

  return (
    <div>
      <header className="cfc-portal-page-head">
        <h1>Edit event</h1>
        <p>Update event details or add more images.</p>
      </header>
      <div className="cfc-portal-panel">
        <CfcEventForm
          initial={{ event_name: event.event_name, event_date: event.event_date }}
          existingImages={event.images ?? []}
          submitLabel="Save changes"
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
          onDeleteImage={handleDeleteImage}
          onCancel={() => router.push(cfcPortalEventsPath())}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
