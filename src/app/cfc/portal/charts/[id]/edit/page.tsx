"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CfcChartForm from "@/components/cfc/CfcChartForm";
import { ApiError } from "@/lib/api/types";
import { cfcPortalChartsPath } from "@/lib/cfc/routes";
import { getCfcPortalChart, updateCfcPortalChart } from "@/services/cfc-portal.service";
import type { CfcChartFormValues, CfcPortalChart } from "@/types/cfc-portal";

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

export default function CfcPortalChartEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id ?? "");
  const [chart, setChart] = useState<CfcPortalChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const data = await getCfcPortalChart(id);
        if (!cancelled) setChart(data);
      } catch (e) {
        if (!cancelled) {
          toast.error(e instanceof ApiError ? e.message : "Failed to load metrics.");
          router.push(cfcPortalChartsPath());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  const handleSubmit = async (values: CfcChartFormValues) => {
    setIsSubmitting(true);
    setFieldErrors({});
    try {
      const payload = toPayload(values);
      await updateCfcPortalChart(id, payload);
      toast.success("Monthly metrics updated.");
      router.push(cfcPortalChartsPath());
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        setFieldErrors(apiErrorsToMap(e.errors));
      }
      toast.error(e instanceof Error ? e.message : "Failed to update metrics.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="cfc-portal-loading">Loading metrics…</div>;
  if (!chart) return null;

  return (
    <div>
      <header className="cfc-portal-page-head">
        <h1>Edit monthly metrics</h1>
        <p>Update income, expenses, or capacity usage for this month.</p>
      </header>
      <div className="cfc-portal-panel">
        <CfcChartForm
          initial={{
            year: chart.year,
            month: chart.month,
            income_month_year_wise: String(chart.income_month_year_wise ?? ""),
            expenses_month_year_wise: String(chart.expenses_month_year_wise ?? ""),
            capacity_usage_month_year_wise: String(chart.capacity_usage_month_year_wise ?? ""),
          }}
          submitLabel="Save changes"
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
          onCancel={() => router.push(cfcPortalChartsPath())}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
