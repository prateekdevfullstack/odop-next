"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CfcActivityForm from "@/components/cfc/CfcActivityForm";
import { ApiError } from "@/lib/api/types";
import { apiFieldErrorsToMap } from "@/lib/cfc/form";
import { cfcPortalActivitiesPath } from "@/lib/cfc/routes";
import { createCfcPortalActivity } from "@/services/cfc-portal.service";
import type { CfcActivityFormData } from "@/types/cfc-activity";

export default function CfcPortalActivityNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: CfcActivityFormData) => {
    setIsSubmitting(true);
    setFieldErrors({});
    try {
      await createCfcPortalActivity(values);
      toast.success("Activity created successfully.");
      router.push(cfcPortalActivitiesPath());
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        setFieldErrors(apiFieldErrorsToMap(e.errors as Record<string, string | string[]>));
      }
      toast.error(e instanceof ApiError ? e.message : "Failed to create activity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="cfc-portal-page-head">
        <h1>Add activity</h1>
        <p>Enter the activity name and date.</p>
      </header>
      <div className="cfc-portal-panel">
        <CfcActivityForm
          submitLabel="Create activity"
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
          onCancel={() => router.push(cfcPortalActivitiesPath())}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
