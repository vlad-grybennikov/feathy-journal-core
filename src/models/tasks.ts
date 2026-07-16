import type { ITask } from '../api/tasks/types';

/**
 * Task type with nested children array for hierarchical operations
 * Used throughout the app where tasks are organized in a tree structure
 */
export type TaskWithChildren = ITask & { children: TaskWithChildren[] };
