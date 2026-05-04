import type { UsageTimeRange } from '@/utils/usage';

export const DEFAULT_USAGE_TIME_RANGE: UsageTimeRange = '24h';

export const USAGE_TIME_RANGE_OPTIONS: ReadonlyArray<{ value: UsageTimeRange; labelKey: string }> = [
  { value: '24h', labelKey: 'usage_stats.range_24h' },
  { value: 'today', labelKey: 'usage_stats.range_today' },
  { value: '7d', labelKey: 'usage_stats.range_7d' },
  { value: '30d', labelKey: 'usage_stats.range_30d' },
  { value: 'all', labelKey: 'usage_stats.range_all' }
];

export const HOUR_WINDOW_BY_USAGE_TIME_RANGE: Record<Exclude<UsageTimeRange, 'today' | 'all'>, number> = {
  '24h': 24,
  '7d': 7 * 24,
  '30d': 30 * 24
};

export const getUsageTimeRangeHourWindow = (
  range: UsageTimeRange,
  nowMs: number = Date.now()
): number | undefined => {
  if (range === 'all') {
    return undefined;
  }
  if (range === 'today') {
    const now = new Date(nowMs);
    return now.getHours() + 1;
  }
  return HOUR_WINDOW_BY_USAGE_TIME_RANGE[range];
};

export const getUsageTimeRangeMinuteWindow = (
  range: UsageTimeRange,
  nowMs: number = Date.now()
): number => {
  if (range === 'all') {
    return 30;
  }
  if (range === 'today') {
    const now = new Date(nowMs);
    return Math.max(now.getHours() * 60 + now.getMinutes() + 1, 1);
  }
  return HOUR_WINDOW_BY_USAGE_TIME_RANGE[range] * 60;
};

export const isUsageTimeRange = (value: unknown): value is UsageTimeRange =>
  value === 'today' ||
  value === '24h' ||
  value === '7d' ||
  value === '30d' ||
  value === 'all';
