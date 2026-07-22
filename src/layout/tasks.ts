import { LAYOUT_VERSION, type ScreenLayout } from './types';

/**
 * The Tasks screen's structure. The hybrid rule at its clearest: this screen
 * is almost entirely interactive (date selection, forms, optimistic toggles),
 * so the schema only places the three surfaces — the header with its actions,
 * the week strip, and the task list. All state and the create/edit form modal
 * live in the screen and its components.
 */
export const tasksLayout: ScreenLayout = {
  version: LAYOUT_VERSION,
  screen: 'tasks',
  nodes: [
    // Title + Transfer (move incomplete tasks to the next day) + New Task.
    { type: 'TasksHeader' },
    // 7-day (3-day on narrow) date strip with per-day completion dots.
    { type: 'WeekStrip' },
    // The TaskCard tree for the selected day.
    { type: 'TaskList' },
  ],
};
