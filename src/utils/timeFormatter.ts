import { TimeAccumulationItem } from "../models/common";
import type { TaskWithChildren } from "../models/tasks";

/**
 * Converts time format like "1h 30m" to seconds
 * Supports: "1h", "30m", "1h 30m", "90m", etc.
 */
export function timeToSeconds(timeStr: string | undefined | null) {
  if (!timeStr || typeof timeStr !== 'string') return null;

  const trimmed = timeStr.trim().toLowerCase();
  if (!trimmed) return null;

  let totalSeconds = 0;

  // Match hours (e.g., "1h")
  const hoursMatch = trimmed.match(/(\d+)\s*h/);
  if (hoursMatch) {
    totalSeconds += parseInt(hoursMatch[1], 10) * 3600;
  }

  // Match minutes (e.g., "30m")
  const minutesMatch = trimmed.match(/(\d+)\s*m(?!\w)/);
  if (minutesMatch) {
    totalSeconds += parseInt(minutesMatch[1], 10) * 60;
  }

  return totalSeconds || null;
}

/**
 * Converts seconds to human-readable format like "1h 30m"
 * Returns null for null/undefined/0 values
 */
export function secondsToTime(seconds: number | undefined | null) {
  if (!seconds || seconds === 0) return null;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.length > 0 ? parts.join(' ') : null;
}

/**
 * Formats time for display, handling null/0 values
 */
export function formatTimeDisplay(seconds: number | null | undefined) {
  const formatted = secondsToTime(seconds);
  return formatted || '-';
}

/**
 * Gets today's date in the user's local timezone as YYYY-MM-DD string
 * (Fixes timezone offset issues where UTC dates appear as next day locally)
 */
export function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates accumulated time from an item and all its children recursively
 * Assumes filtering has already been done before calling this function
 * Returns the total seconds including the item and all children
 */
export function calculateAccumulatedTime(item: TimeAccumulationItem) {
  let total = item.time || 0;

  if (item.children) {
    for (const child of item.children) {
      total += calculateAccumulatedTime(child);
    }
  }

  return total;
}

/**
 * Sums the time (in seconds) of a task and all of its descendants, ignoring
 * the time contributed by tasks that are already done. Used to show the
 * remaining estimated time for a task tree.
 */
export function accumulatedIncompleteTime(task: TaskWithChildren): number {
  const ownTime = task.isDone ? 0 : task.time || 0;
  return task.children.reduce(
    (sum, child) => sum + accumulatedIncompleteTime(child),
    ownTime
  );
}
