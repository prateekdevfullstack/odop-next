import { useState, useEffect, useMemo } from "react";
import { fetchUnifiedEnquiries } from "@/services/district-admin-enquiries.service";
import type { UnifiedEnquiryListQuery, UnifiedEnquiryListResponse } from "@/types/unified-enquiry";

export function useUnifiedEnquiries(query: UnifiedEnquiryListQuery) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<UnifiedEnquiryListResponse | null>(null);

  const queryKey = useMemo(() => JSON.stringify(query), [query]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUnifiedEnquiries(query);
        if (!cancelled) {
          setResponse(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load unified enquiries"));
          setResponse(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [queryKey]);

  return {
    loading,
    error,
    data: response?.data ?? [],
    pagination: response?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
}
