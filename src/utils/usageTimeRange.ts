import {
  getUsageTimeRangeEndMs,
  getUsageTimeRangeStartMs,
  type UsageTimeRange
} from '@/utils/usage';

export const DEFAULT_USAGE_TIME_RANGE: UsageTimeRange = '24h';

export const USAGE_TIME_RANGE_OPTIONS: ReadonlyArray<{ value: UsageTimeRange; labelKey: string }> = [
  { value: 'yesterday', labelKey: 'usage_stats.range_yesterday' },
  { value: 'today', labelKey: 'usage_stats.range_today' },
  { value: '24h', labelKey: 'usage_stats.range_24h' },
  { value: '7d', labelKey: 'usage_stats.range_7d' },
  { value: '30d', labelKey: 'usage_stats.range_30d' },
  { value: 'all', labelKey: 'usage_stats.range_all' }
];

export const HOUR_WINDOW_BY_USAGE_TIME_RANGE: Record<Exclude<UsageTimeRange, 'today' | 'yesterday' | 'all'>, number> = {
  '24h': 24,
  '7d': 7 * 24,
  '30d': 30 * 24
};

const getUsageTimeRangeDurationMs = (range: UsageTimeRange, nowMs: number): number | null => {
  const startMs = getUsageTimeRangeStartMs(range, nowMs);
  const endMs = getUsageTimeRangeEndMs(range, nowMs);
  if (startMs === null || endMs === null) {
    return null;
  }
  return Math.max(endMs - startMs, 0);
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
  if (range === 'yesterday') {
    const durationMs = getUsageTimeRangeDurationMs(range, nowMs);
    return durationMs === null ? 24 : Math.max(Math.ceil(durationMs / (60 * 60 * 1000)), 1);
  }
  return HOUR_WINDOW_BY_USAGE_TIME_RANGE[range];
};

export const getUsageTimeRangeHourWindowEndMs = (
  range: UsageTimeRange,
  nowMs: number
): number | undefined => {
  if (!Number.isFinite(nowMs) || nowMs <= 0 || range === 'all') {
    return undefined;
  }
  const endMs = getUsageTimeRangeEndMs(range, nowMs);
  if (endMs === null) {
    return undefined;
  }
  return range === 'yesterday' ? endMs - 1 : endMs;
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
  if (range === 'yesterday') {
    const durationMs = getUsageTimeRangeDurationMs(range, nowMs);
    return durationMs === null ? 24 * 60 : Math.max(Math.ceil(durationMs / (60 * 1000)), 1);
  }
  return HOUR_WINDOW_BY_USAGE_TIME_RANGE[range] * 60;
};

export const getUsageTimeRangeRateEndMs = (
  range: UsageTimeRange,
  nowMs: number
): number | undefined => {
  if (!Number.isFinite(nowMs) || nowMs <= 0 || range === 'all') {
    return undefined;
  }
  return getUsageTimeRangeEndMs(range, nowMs) ?? undefined;
};

export const isUsageTimeRange = (value: unknown): value is UsageTimeRange =>
  value === 'today' ||
  value === 'yesterday' ||
  value === '24h' ||
  value === '7d' ||
  value === '30d' ||
  value === 'all';
