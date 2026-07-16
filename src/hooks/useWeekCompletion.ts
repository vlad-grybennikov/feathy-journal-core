import { useEffect, useMemo, useState } from 'react';
import { getTasks, ITask, DateString } from '../api';
import { getWeekDates, addDays } from '../utils/weekDates';

/**
 * Per-day completion status used by the week strip indicators.
 * - `complete`: the day has tasks and all of them are done
 * - `partial`:  the day has tasks and some (but not all) are done
 * - `empty`:    the day has no tasks, or none are done yet
 */
export type DayStatus = 'complete' | 'partial' | 'empty';

/** Derive a day's completion status from its flat task list. */
export function computeDayStatus(tasks: ITask[]): DayStatus {
  if (tasks.length === 0) return 'empty';
  const doneCount = tasks.filter((task) => task.isDone).length;
  if (doneCount === tasks.length) return 'complete';
  if (doneCount > 0) return 'partial';
  return 'empty';
}

/**
 * Fetches completion status for every day in the week containing `selectedDate`.
 *
 * The backend only serves one day at a time, so this fans out 7 requests in
 * parallel. Results are keyed by the week's Sunday, so switching days *within*
 * the same week does not refetch. Bump `refreshToken` to force a refetch (e.g.
 * after an auto-transfer moves tasks between days).
 */
export function useWeekCompletion(selectedDate: string, refreshToken: number = 0) {
  const weekStart = useMemo(() => getWeekDates(selectedDate)[0], [selectedDate]);
  const [statusMap, setStatusMap] = useState<Record<string, DayStatus>>({});

  useEffect(() => {
    let cancelled = false;
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    (async () => {
      try {
        const entries = await Promise.all(
          weekDates.map(async (date) => {
            const tasks = await getTasks({ date: date as DateString });
            return [date, computeDayStatus(tasks)] as const;
          })
        );
        if (!cancelled) {
          setStatusMap(Object.fromEntries(entries));
        }
      } catch {
        // Non-critical: the strip simply renders without done indicators.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [weekStart, refreshToken]);

  return statusMap;
}
