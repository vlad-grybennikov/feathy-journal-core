import type { IMeasurement } from '../api/measurements';

export interface HealthPoint {
  t: number; // epoch ms
  value: number;
}

export interface HealthSeries {
  key: string;
  name: string;
  unit: string;
  lowerIsBetter: boolean;
  category: string | null;
  source?: string; // provider type of the most recent point (e.g. 'oura')
  points: HealthPoint[]; // sorted ascending by time
}

export type HealthModel = Record<string, HealthSeries>;

/** Group measurements into per-type series (sorted by time). */
export const buildHealthModel = (measurements: IMeasurement[]): HealthModel => {
  const model: HealthModel = {};
  const latestSourceT: Record<string, number> = {}; // ts of the point that set `source`
  for (const m of measurements) {
    const key = m.typeId?.key;
    if (!key) continue;
    if (!model[key]) {
      model[key] = {
        key,
        name: m.typeId.name,
        unit: m.unitId?.unit ?? '',
        lowerIsBetter: !!m.typeId.lowerIsBetter,
        category: m.typeId.category ?? null,
        points: [],
      };
    }
    const t = new Date(m.timestamp).getTime();
    model[key].points.push({ t, value: m.value });
    // Track the provider of the most recent measurement (robust to input order).
    if (m.sourceId?.type && (latestSourceT[key] === undefined || t >= latestSourceT[key])) {
      latestSourceT[key] = t;
      model[key].source = m.sourceId.type;
    }
  }
  Object.values(model).forEach((s) => s.points.sort((a, b) => a.t - b.t));
  return model;
};

export const latest = (s?: HealthSeries): number | undefined =>
  s && s.points.length ? s.points[s.points.length - 1].value : undefined;

export const previous = (s?: HealthSeries): number | undefined =>
  s && s.points.length > 1 ? s.points[s.points.length - 2].value : undefined;

/** Rounded delta of the latest point vs the previous one. */
export const delta = (s?: HealthSeries): number | undefined => {
  const a = latest(s);
  const b = previous(s);
  if (a == null || b == null) return undefined;
  const d = a - b;
  return Math.abs(d) < 1 ? Math.round(d * 10) / 10 : Math.round(d);
};

/** Last N values, for a sparkline. */
export const spark = (s?: HealthSeries, n = 10): number[] => (s ? s.points.slice(-n).map((p) => p.value) : []);

/** Last N points (with time), for weekly charts. */
export const lastN = (s?: HealthSeries, n = 7): HealthPoint[] => (s ? s.points.slice(-n) : []);

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const weekdayLabel = (t: number) => WEEKDAYS[new Date(t).getUTCDay()];
