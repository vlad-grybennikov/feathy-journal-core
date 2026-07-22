import { LAYOUT_VERSION, type ScreenLayout } from './types';

/**
 * The Routines screen's structure. Like Tasks, this screen is almost entirely
 * interactive (active toggles, expand/collapse, the create/edit form with the
 * RRule builder), so the schema only places the two surfaces — the header with
 * its actions and the routine tree. State and the form modal live in the
 * screen and its components.
 */
export const routinesLayout: ScreenLayout = {
  version: LAYOUT_VERSION,
  screen: 'routines',
  nodes: [
    // Title + Generate Tasks (materialize today's tasks) + New Routine.
    { type: 'RoutinesHeader' },
    // The RoutineNode tree: toggle, recurrence description, actions menu.
    { type: 'RoutineList' },
  ],
};
