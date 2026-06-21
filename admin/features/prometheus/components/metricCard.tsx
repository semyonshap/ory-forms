import { Badge } from "@/components/ui/badge";
import { MetricData } from "@/features/prometheus";
import { cn } from "@/lib/utils";

const FORMATTERS: Array<{
  pattern: RegExp;
  format: (m: MetricData) => string;
}> = [
  {
    pattern: /_bytes$/,
    format: (m) => `${(m.value / 1024 / 1024).toFixed(2)} MB`,
  },
  { pattern: /_seconds$/, format: (m) => `${(m.value * 1000).toFixed(2)} ms` },
  { pattern: /_total$/, format: (m) => m.value.toLocaleString() },
  { pattern: /_percent$/, format: (m) => `${m.value}%` },
];

function formatValue(metric: MetricData): string {
  for (const { pattern, format } of FORMATTERS) {
    if (pattern.test(metric.name)) return format(metric);
  }
  return Number.isInteger(metric.value)
    ? metric.value.toLocaleString()
    : metric.value.toFixed(4);
}

const TYPE_COLORS: Record<string, string> = {
  gauge: "bg-blue-100 text-blue-800",
  counter: "bg-green-100 text-green-800",
  histogram: "bg-purple-100 text-purple-800",
  summary: "bg-orange-100 text-orange-800",
};

export function MetricCard({ metric }: { metric: MetricData }) {
  const value = formatValue(metric);
  const badgeClass = TYPE_COLORS[metric.type] || "bg-gray-100 text-gray-800";

  const extra: string[] = [];
  if (metric.type === "histogram" && metric.count && metric.sum) {
    extra.push(`avg: ${((metric.sum / metric.count) * 1000).toFixed(2)}ms`);
    extra.push(`n=${metric.count}`);
  }
  if (metric.type === "summary" && metric.quantiles) {
    const p50 = metric.quantiles["0.5"];
    const p99 = metric.quantiles["1"];
    if (p50) extra.push(`p50: ${(p50 * 1000).toFixed(2)}ms`);
    if (p99) extra.push(`p99: ${(p99 * 1000).toFixed(2)}ms`);
  }

  return (
    <div className="rounded-xl bg-card py-4 px-4 text-sm text-card-foreground ring-1 ring-foreground/10">
      <div className="flex items-start justify-between gap-1 overflow-hidden min-w-0">
        <span className="min-w-0 text-sm font-medium font-mono truncate">
          {metric.name}
        </span>
        <Badge className={cn("text-xs shrink-0", badgeClass)}>
          {metric.type}
        </Badge>
      </div>
      {metric.help && (
        <div className="text-xs text-muted-foreground mt-1">{metric.help}</div>
      )}
      <div className="text-2xl font-bold mt-2 truncate">{value}</div>
      {extra.length > 0 && (
        <div className="text-xs text-muted-foreground mt-1">
          {extra.join(" · ")}
        </div>
      )}
    </div>
  );
}
