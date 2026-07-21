/**
 * Shared health-metric presentation data — colors, score bands, and value
 * formatters. Both platforms were carrying near-identical copies of this in
 * their healthMeta.tsx; the data now lives here so it cannot drift.
 *
 * Icons deliberately stay per-platform: web imports lucide-react, mobile
 * lucide-react-native. Each platform keeps a `{ key -> icon }` map and merges
 * it with this shared meta.
 */

// Oura-style score bands (0-100).
export const SCORE_BANDS = {
  optimal: '#16a34a',
  good: '#22c55e',
  fair: '#f59e0b',
  low: '#dc2626',
  track: '#eef0f3',
} as const;

export const scoreBand = (v: number): string =>
  v >= 85 ? SCORE_BANDS.optimal : v >= 70 ? SCORE_BANDS.good : v >= 60 ? SCORE_BANDS.fair : SCORE_BANDS.low;

/** Word form of a 0-100 score band (ring sub-labels). */
export const bandWord = (v: number): string =>
  v >= 85 ? 'Optimal' : v >= 70 ? 'Good' : v >= 60 ? 'Fair' : 'Low';

export interface HealthMetaColors {
  color: string;
  soft: string;
  sparkType?: 'line' | 'bar';
}

/** Per-metric accent colors (mirrors the design system's health tokens). */
export const HEALTH_META_COLORS: Record<string, HealthMetaColors> = {
  sleep_score: { color: '#6366f1', soft: '#eef0fe' },
  readiness_score: { color: '#16a34a', soft: '#e7f6ec' },
  activity_score: { color: '#ea580c', soft: '#fdeee4' },
  hrv: { color: '#0ea5e9', soft: '#e3f4fd' },
  resting_hr: { color: '#dc2626', soft: '#fdeaea' },
  steps: { color: '#ea580c', soft: '#fdeee4', sparkType: 'bar' },
  active_calories: { color: '#ea580c', soft: '#fdeee4', sparkType: 'bar' },
  sleep_duration: { color: '#6366f1', soft: '#eef0fe' },
  temp_deviation: { color: '#f59e0b', soft: '#fef2e0' },
  spo2: { color: '#0ea5e9', soft: '#e3f4fd' },
  respiratory_rate: { color: '#8b5cf6', soft: '#f1ebfe' },
  stress_high: { color: '#e11d48', soft: '#fde7ec' },
  pulse_wave_velocity: { color: '#be123c', soft: '#fde7ec' },
  vascular_age: { color: '#be123c', soft: '#fde7ec' },
  vo2_max: { color: '#0d9488', soft: '#e0f5f2' },
};

export const DEFAULT_META_COLORS: HealthMetaColors = { color: '#64748b', soft: '#eef1f5' };

export const metaColorsFor = (key: string): HealthMetaColors =>
  HEALTH_META_COLORS[key] ?? DEFAULT_META_COLORS;

/**
 * Deterministic thousands separator.
 *
 * NOT toLocaleString(): Hermes (mobile) renders it with a space ("8 880")
 * while browsers use a comma ("8,880") — the exact cross-platform drift this
 * module exists to prevent.
 */
export const formatThousands = (n: number): string =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const secToHm = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

/** Format a metric value for display, given its type key. */
export const formatHealthValue = (key: string, value: number): string => {
  switch (key) {
    case 'sleep_duration':
    case 'stress_high':
    case 'recovery_high':
      return secToHm(value);
    case 'steps':
    case 'active_calories':
      return formatThousands(value);
    case 'temp_deviation':
    case 'temp_trend_deviation':
      return `${value > 0 ? '+' : ''}${value.toFixed(1)}`;
    default:
      return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
};

/** Human display unit for a metric (raw unit codes → symbols; hidden for formatted values). */
export const displayUnit = (key: string, unit: string): string => {
  if (['sleep_duration', 'steps', 'stress_high', 'recovery_high', 'active_calories'].includes(key)) return '';
  const map: Record<string, string> = {
    C: '°C',
    percent: '%',
    breaths_per_min: '/min',
    score: '',
    count: '',
    years: 'yrs',
  };
  return unit in map ? map[unit] : unit;
};
