import { useQuery } from "@tanstack/react-query";
import { fetchMetrics } from "../actions/metrics";
import { parsePrometheusMetrics } from "../utils/parser";
import { MetricService } from "../types";

export function useMetrics(
  service: MetricService,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["metrics", service],
    queryFn: async () => {
      const text = await fetchMetrics(service);
      if (!text) throw new Error("Failed to fetch metrics");
      return parsePrometheusMetrics(text);
    },
    refetchInterval: 1000,
    enabled: options?.enabled ?? true,
  });
}
