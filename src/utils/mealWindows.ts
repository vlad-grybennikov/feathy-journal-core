import type { ILoggedMeal, ILoggedItem } from '../api/food';

/**
 * Meal sections are a FE-only presentation grouping of logged items by time of
 * day — nothing about the section is stored in Mongo. A logged entry's `time`
 * ("HH:MM", legacy "h:mm AM/PM", or ISO) decides which window it falls in.
 */
export type WinKey = 'breakfast' | 'lunch' | 'dinner' | 'night';

export const MEAL_WINDOWS: { key: WinKey; label: string; color: string }[] = [
  { key: 'breakfast', label: 'Breakfast', color: '#f59e0b' }, // 06–12
  { key: 'lunch', label: 'Lunch', color: '#f97316' }, //         12–16
  { key: 'dinner', label: 'Dinner', color: '#6366f1' }, //       16–24
  { key: 'night', label: 'Night meal', color: '#64748b' }, //    00–06
];

/** Parse a stored `time` to an hour 0–23. */
export function hourOf(time?: string | null): number {
  if (!time) return 12;
  const s = time.trim();
  const ampm = /^(\d{1,2}):(\d{2})\s*([ap]m)$/i.exec(s);
  if (ampm) {
    const h = parseInt(ampm[1], 10) % 12;
    return /pm/i.test(ampm[3]) ? h + 12 : h;
  }
  const h24 = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (h24) return Math.min(23, parseInt(h24[1], 10));
  const d = new Date(s);
  return isNaN(d.getTime()) ? 12 : d.getHours();
}

export const winForHour = (h: number): WinKey =>
  h >= 6 && h < 12 ? 'breakfast' : h >= 12 && h < 16 ? 'lunch' : h >= 16 ? 'dinner' : 'night';

export const windowLabel = (h: number) => MEAL_WINDOWS.find((w) => w.key === winForHour(h))!.label;

const pad2 = (n: number) => String(n).padStart(2, '0');
export const nowHHMM = () => {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

/** Default add-sheet time for a window: now if we're in it, else a representative time. */
export function windowDefaultTime(key: WinKey): string {
  const now = new Date();
  if (winForHour(now.getHours()) === key) return nowHHMM();
  return { breakfast: '08:00', lunch: '13:00', dinner: '19:00', night: '01:00' }[key];
}

export type WindowRow = ILoggedItem & { mealId: string };
export interface WindowGroup {
  key: WinKey;
  label: string;
  color: string;
  items: WindowRow[];
  calories: number;
}

/**
 * Group every logged item into its time-of-day window, in display order,
 * dropping empty windows. Empty/duplicate meal docs simply contribute no items,
 * so they never render.
 */
export function groupMealsByWindow(meals: ILoggedMeal[]): WindowGroup[] {
  const byKey: Record<WinKey, WindowRow[]> = { breakfast: [], lunch: [], dinner: [], night: [] };
  for (const m of meals) {
    const key = winForHour(hourOf(m.time));
    for (const it of m.items) byKey[key].push({ ...it, mealId: m._id });
  }
  return MEAL_WINDOWS.map((w) => ({
    ...w,
    items: byKey[w.key],
    calories: byKey[w.key].reduce((s, it) => s + (it.calories || 0), 0),
  })).filter((g) => g.items.length > 0);
}
