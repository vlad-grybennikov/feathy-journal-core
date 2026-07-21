/**
 * @feathy/journal-core
 *
 * The platform-agnostic half of Feathy Journal: the `/api/v1` client, the
 * shared React contexts, and the domain logic — consumed by both the Next.js
 * web app and the React Native app.
 *
 * Call `configure()` once at boot before anything else:
 *
 * ```ts
 * configure({ apiUrl, storage, onAuthFailure });
 * ```
 */

export { configure, getConfig, isConfigured } from './config';
export type { CoreConfig, TokenStorage } from './config';

export * from './api';

export * from './contexts/AuthContext';
export * from './contexts/CategoriesContext';
export * from './contexts/ProvidersContext';

export * from './hooks/useWeekCompletion';

export type { TimeAccumulationItem } from './models/common';
export type { TaskWithChildren } from './models/tasks';
export type { MacroTotals } from './models/nutrition';

export * from './layout/types';
export * from './layout/health';

export * from './utils/errors';
export * from './utils/healthModel';
export * from './utils/mealWindows';
export * from './utils/meal';
export * from './utils/rrule';
export * from './utils/taskHierarchy';
export * from './utils/timeFormatter';
export * from './utils/weekDates';
