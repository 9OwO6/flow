import type { PoopRecord } from '@/types';
import { DietTag, SmoothLevel } from '@/types';

export type SummaryTrend = 'up' | 'down' | 'steady';

export type Summary7dModel = {
  rangeStart: string;
  rangeEnd: string;
  totalRecords: number;
  avgSmoothNumeric: number | null;
  trend: SummaryTrend;
  tagCounts: { tag: DietTag; count: number }[];
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Last 7 calendar days including today: [start, end] as YYYY-MM-DD */
export function getLast7DayRange(now = new Date()): { start: string; end: string } {
  const end = startOfDay(now);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export function filterRecordsInRange(
  records: PoopRecord[],
  start: string,
  end: string
): PoopRecord[] {
  return records.filter((r) => r.date >= start && r.date <= end);
}

function avgSmooth(records: PoopRecord[]): number | null {
  if (records.length === 0) return null;
  const sum = records.reduce((a, r) => a + r.smoothLevel, 0);
  return sum / records.length;
}

/** Compare activity in first 3 days vs last 3 days of the 7-day window */
function computeTrend(records: PoopRecord[], start: string): SummaryTrend {
  const startDate = new Date(start + 'T12:00:00');
  const buckets: number[] = [0, 0, 0, 0, 0, 0, 0];
  for (const r of records) {
    const d = new Date(r.date + 'T12:00:00');
    const idx = Math.round(
      (d.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (idx >= 0 && idx < 7) buckets[idx] += 1;
  }
  const early = buckets[0] + buckets[1] + buckets[2];
  const late = buckets[4] + buckets[5] + buckets[6];
  if (late > early + 1) return 'up';
  if (early > late + 1) return 'down';
  return 'steady';
}

function collectDietTags(records: PoopRecord[]): Map<DietTag, number> {
  const m = new Map<DietTag, number>();
  for (const r of records) {
    const tags = r.dietTags;
    if (!tags?.length) continue;
    for (const t of tags) {
      if (t === DietTag.NONE) continue;
      m.set(t, (m.get(t) ?? 0) + 1);
    }
  }
  return m;
}

export function buildSummary7dModel(records: PoopRecord[]): Summary7dModel {
  const { start, end } = getLast7DayRange();
  const inRange = filterRecordsInRange(records, start, end);
  const tagMap = collectDietTags(inRange);
  const tagCounts = Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    rangeStart: start,
    rangeEnd: end,
    totalRecords: inRange.length,
    avgSmoothNumeric: avgSmooth(inRange),
    trend:
      inRange.length < 2 ? 'steady' : computeTrend(inRange, start),
    tagCounts,
  };
}

export function smoothLevelFromAverage(avg: number | null): SmoothLevel {
  if (avg == null) return SmoothLevel.NORMAL;
  const rounded = Math.round(avg) as SmoothLevel;
  if (rounded < SmoothLevel.VERY_DIFFICULT) return SmoothLevel.VERY_DIFFICULT;
  if (rounded > SmoothLevel.VERY_SMOOTH) return SmoothLevel.VERY_SMOOTH;
  return rounded;
}
