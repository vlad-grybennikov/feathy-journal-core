/**
 * Local-timezone-safe helpers for the week strip.
 *
 * Note: we deliberately avoid `Date.toISOString()` for date math because it
 * converts to UTC and can shift the day by one near midnight / in negative
 * timezone offsets. All helpers here operate in the user's local timezone.
 */

/** Parse a 'YYYY-MM-DD' string into a local Date (no UTC shift). */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Format a local Date as 'YYYY-MM-DD'. */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Add (or subtract) days to a 'YYYY-MM-DD' string, returning a new 'YYYY-MM-DD'. */
export function addDays(dateStr: string, days: number): string {
  const date = parseLocalDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

/**
 * Returns the 7 dates (Sunday → Saturday) of the week containing `dateStr`,
 * each as a 'YYYY-MM-DD' string.
 */
export function getWeekDates(dateStr: string): string[] {
  const date = parseLocalDate(dateStr);
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + i);
    return formatLocalDate(day);
  });
}

/** Short weekday label for a day index where 0 = Sunday. */
export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
