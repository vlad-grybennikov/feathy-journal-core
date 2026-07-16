// Priority levels for tasks and routines
export enum Priority {
  MINOR = 'minor',
  NORMAL = 'normal',
  CRITICAL = 'critical',
}

// Default priority
export const DEFAULT_PRIORITY = Priority.MINOR;

// Priority labels for display in UI (capitalized)
export const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.MINOR]: 'Minor',
  [Priority.NORMAL]: 'Normal',
  [Priority.CRITICAL]: 'Critical',
};

// All available priorities
export const PRIORITIES = Object.values(Priority);
