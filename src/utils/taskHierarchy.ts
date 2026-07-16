import type { TaskWithChildren } from '../models/tasks';
import type { ITask } from '../api/tasks/types';
import type { IRoutine } from '../api/routines/types';

/**
 * Flattens a hierarchical task structure into a flat list of all tasks
 */
export function flattenTaskHierarchy(tasks: TaskWithChildren[]) {
  const flattened: ITask[] = [];

  const traverse = (taskList: TaskWithChildren[]) => {
    for (const task of taskList) {
      const { children, ...taskWithoutChildren } = task;
      flattened.push(taskWithoutChildren);
      if (children && children.length > 0) {
        traverse(children);
      }
    }
  };

  traverse(tasks);
  return flattened;
}

type RoutineWithChildren = IRoutine & { children?: RoutineWithChildren[] };

/**
 * Flattens a hierarchical routine structure into a flat list of all routines
 */
export function flattenRoutineHierarchy(routines: RoutineWithChildren[]) {
  const flattened: IRoutine[] = [];

  const traverse = (routineList: RoutineWithChildren[]) => {
    for (const routine of routineList) {
      const { children, ...routineWithoutChildren } = routine;
      flattened.push(routineWithoutChildren);
      if (children && children.length > 0) {
        traverse(children);
      }
    }
  };

  traverse(routines);
  return flattened;
}
