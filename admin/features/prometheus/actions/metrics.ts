"use server";

import { requiredUrl } from "@/lib/sdk";
import { MetricService } from "../types";

const SERVICE_ENV: Record<MetricService, string> = {
  kratos: "KRATOS_ADMIN_URL",
  hydra: "HYDRA_ADMIN_URL",
  keto: "KETO_ADMIN_URL",
};

const SERVICE_PATH: Record<MetricService, string> = {
  kratos: "/admin/metrics/prometheus",
  hydra: "/admin/metrics/prometheus",
  keto: "/metrics/prometheus",
};

export async function fetchMetrics(
  service: MetricService,
): Promise<string | null> {
  const baseUrl = requiredUrl(SERVICE_ENV[service]);
  const url = `${baseUrl}${SERVICE_PATH[service]}`;

  const response = await fetch(url);
  const data = await response.text();

  return data;
}
