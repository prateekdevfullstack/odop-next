"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CfcChartForm from "@/components/cfc/CfcChartForm";
import { ApiError } from "@/lib/api/types";
import { cfcPortalChartsPath } from "@/lib/cfc/routes";
import { createCfcPortalChart } from "@/services/cfc-portal.service";
import type { CfcChartFormValues } from "@/types/cfc-portal";

function apiErrorsToMap(errors?: Record<string, string[]>): Record<string, string> {
  if (!errors) return {};
  const out: Record<string, string> = {};
  for (const [key, arr] of Object.entries(errors)) {
    if (arr?.[0]) out[key] = arr[0];
  }
  return out;
}

function toPayload(values: CfcChartFormValues) {
  const income = values.income_month_year_wise.trim();
  const expenses = values.expenses_month_year_wise.trim();
  const capacity = values.capacity_usage_month_year_wise.trim();
  if (!income && !expenses && !capacity) {
    throw new Error("Enter at least one metric value.");
  }
  return {
    year: values.year.trim(),
    month: values.month,
    ...(income ? { income_month_year_wise: Number(income) } : {}),
    ...(expenses ? { expenses_month_year_wise: Number(expenses) } : {}),
    ...(capacity ? { capacity_usage_month_year_wise: Number(capacity) } : {}),
  };
}

export default function CfcPortalChartNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: CfcChartFormValues) => {
    setIsSubmitting(true);
    setFieldErrors({});
    try {
      const payload = toPayload(values);
      await createCfcPortalChart(payload);
      toast.success("Monthly metrics saved.");
      router.push(cfcPortalChartsPath());
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        setFieldErrors(apiErrorsToMap(e.errors));
      }
      toast.error(e instanceof Error ? e.message : "Failed to save metrics.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="cfc-portal-page-head">
        <h1>Add monthly metrics</h1>
        <p>Enter at least one of income, expenses, or capacity usage.</p>
      </header>
      <div className="cfc-portal-panel">
        <CfcChartForm
          submitLabel="Create metrics"
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
          onCancel={() => router.push(cfcPortalChartsPath())}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
