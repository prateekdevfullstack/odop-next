"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CfcActivityForm from "@/components/cfc/CfcActivityForm";
import { ApiError } from "@/lib/api/types";
import { apiFieldErrorsToMap } from "@/lib/cfc/form";
import { cfcPortalActivitiesPath } from "@/lib/cfc/routes";
import { getCfcPortalActivity, updateCfcPortalActivity } from "@/services/cfc-portal.service";
import type { CfcActivity, CfcActivityFormData } from "@/types/cfc-activity";

export default function CfcPortalActivityEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id ?? "");
  const [activity, setActivity] = useState<CfcActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const data = await getCfcPortalActivity(id);
        if (!cancelled) setActivity(data);
      } catch (e) {
        if (!cancelled) {
          toast.error(e instanceof ApiError ? e.message : "Failed to load activity.");
          router.push(cfcPortalActivitiesPath());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  const handleSubmit = async (values: CfcActivityFormData) => {
    setIsSubmitting(true);
    setFieldErrors({});
    try {
      await updateCfcPortalActivity(id, values);
      toast.success("Activity updated successfully.");
      router.push(cfcPortalActivitiesPath());
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        setFieldErrors(apiFieldErrorsToMap(e.errors as Record<string, string | string[]>));
      }
      toast.error(e instanceof ApiError ? e.message : "Failed to update activity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="cfc-portal-loading">Loading activity…</div>;
  if (!activity) return null;

  return (
    <div>
      <header className="cfc-portal-page-head">
        <h1>Edit activity</h1>
        <p>Update the activity name or date.</p>
      </header>
      <div className="cfc-portal-panel">
        <CfcActivityForm
          initial={{
            activity_name: activity.activity_name,
            activity_date: activity.activity_date,
          }}
          submitLabel="Save changes"
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
          onCancel={() => router.push(cfcPortalActivitiesPath())}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
