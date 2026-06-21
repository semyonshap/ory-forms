"use client";

import { useState } from "react";
import { PageError, PageLoader } from "@/components/custom";
import {
  MetricCard,
  MetricData,
  useMetrics,
  type MetricService,
} from "@/features/prometheus";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

const SERVICES: { value: MetricService; label: string }[] = [
  { value: "kratos", label: "Kratos" },
  { value: "hydra", label: "Hydra" },
  { value: "keto", label: "Keto" },
];

function groupMetrics(metrics: Record<string, MetricData>) {
  const groups: Record<string, MetricData[]> = {};
  for (const metric of Object.values(metrics)) {
    const prefix = metric.name.split("_")[0];
    groups[prefix] = groups[prefix] || [];
    groups[prefix].push(metric);
  }
  return groups;
}

export default function MetricsPage() {
  const [service, setService] = useState<MetricService>("kratos");
  const { data, isLoading, error } = useMetrics(service);

  if (isLoading) return PageLoader();
  if (error) return PageError(error);
  if (!data) return null;

  const groups = groupMetrics(data);

  const copyMetrics = () => {
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <span className="text-2xl font-medium">System Metrics</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={copyMetrics}>
              <CopyIcon className="size-4" />
            </Button>
            <Select
              value={service}
              onValueChange={(v: MetricService) => setService(v)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>
      {Object.entries(groups).map(([group, metrics]) => (
        <section key={group}>
          <h2 className="text-lg font-semibold mb-3 capitalize">
            {group}_*{" "}
            <span className="text-sm text-muted-foreground font-normal">
              ({metrics.length} metrics)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.name} metric={metric} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
