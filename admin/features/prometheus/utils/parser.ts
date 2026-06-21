import { MetricsResponse, MetricType } from "../types";

function getBaseName(metricName: string): string {
  for (const suffix of ["_bucket", "_sum", "_count"]) {
    if (metricName.endsWith(suffix)) {
      return metricName.slice(0, -suffix.length);
    }
  }
  return metricName;
}

function parseLabels(labelStr: string): Record<string, string> {
  const labels: Record<string, string> = {};
  if (!labelStr) return labels;
  // Разбираем: key="value",key2="value2"
  const regex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(labelStr)) !== null) {
    labels[match[1]] = match[2];
  }
  return labels;
}

export function parsePrometheusMetrics(text: string): MetricsResponse {
  const lines = text.split("\n");
  const metrics: MetricsResponse = {};

  // Сначала собираем мета-информацию (HELP, TYPE)
  const metaHelp: Record<string, string> = {};
  const metaType: Record<string, MetricType> = {};

  for (const line of lines) {
    if (line.startsWith("# HELP ")) {
      const idx = line.indexOf(" ", 7); // после "# HELP "
      const name = line.slice(7, idx);
      const help = line.slice(idx + 1);
      metaHelp[name] = help;
    } else if (line.startsWith("# TYPE ")) {
      const parts = line.slice(7).split(" ");
      metaType[parts[0]] = parts[1] as MetricType;
    }
  }

  // Затем парсим значения
  for (const line of lines) {
    if (line.startsWith("#") || !line.trim()) continue;

    // Разбираем строку: name{labels} value или name value
    const braceOpen = line.indexOf("{");
    const braceClose = line.indexOf("}");
    let rawName: string;
    let labelStr = "";
    let valueStr: string;

    if (braceOpen !== -1) {
      rawName = line.slice(0, braceOpen);
      labelStr = line.slice(braceOpen + 1, braceClose);
      valueStr = line.slice(braceClose + 2).split(" ")[0]; // +2 для "} "
    } else {
      const spaceIdx = line.indexOf(" ");
      rawName = line.slice(0, spaceIdx);
      valueStr = line.slice(spaceIdx + 1).split(" ")[0];
    }

    const value = parseFloat(valueStr);
    if (isNaN(value)) continue;

    const baseName = getBaseName(rawName);
    const type = metaType[baseName] || metaType[rawName] || "unknown";
    const help = metaHelp[baseName] || metaHelp[rawName] || "";

    // Инициализируем метрику если ещё нет
    if (!metrics[baseName]) {
      metrics[baseName] = {
        name: baseName,
        value: 0,
        type,
        help,
      };
    }

    const metric = metrics[baseName];

    if (type === "histogram") {
      if (rawName.endsWith("_bucket")) {
        const labels = parseLabels(labelStr);
        const le = labels["le"];
        if (le && le !== "+Inf") {
          metric.buckets = metric.buckets || {};
          metric.buckets[le] = value;
        }
        if (le === "+Inf") metric.value = value; // total count
      } else if (rawName.endsWith("_sum")) {
        metric.sum = value;
      } else if (rawName.endsWith("_count")) {
        metric.count = value;
        // Средняя латентность = sum / count
        if (metric.sum !== undefined && value > 0) {
          metric.value = metric.sum / value;
        }
      }
    } else if (type === "summary") {
      if (rawName.endsWith("_sum")) {
        metric.sum = value;
      } else if (rawName.endsWith("_count")) {
        metric.count = value;
      } else {
        // Это quantile строка
        const labels = parseLabels(labelStr);
        const quantile = labels["quantile"];
        if (quantile) {
          metric.quantiles = metric.quantiles || {};
          metric.quantiles[quantile] = value;
        }
      }
    } else {
      // gauge / counter — агрегируем если несколько label-вариантов (суммируем)
      if (rawName === baseName) {
        // Без labels — просто берём значение
        metric.value = value;
      } else {
        // С labels — суммируем (например http_requests_total по разным code)
        metric.value = (metric.value || 0) + value;
      }
    }
  }

  return metrics;
}
