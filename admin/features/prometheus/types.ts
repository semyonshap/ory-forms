export type MetricType =
  | "gauge"
  | "counter"
  | "histogram"
  | "summary"
  | "unknown";

export interface MetricData {
  name: string;
  value: number; // для gauge/counter — само значение
  type: MetricType;
  help: string;
  // для histogram/summary — дополнительные данные
  sum?: number;
  count?: number;
  buckets?: Record<string, number>; // le -> count
  quantiles?: Record<string, number>; // quantile -> value
}

export interface MetricsResponse {
  [name: string]: MetricData;
}

export type MetricService = "kratos" | "hydra" | "keto";