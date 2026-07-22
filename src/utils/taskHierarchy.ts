import type { TaskWithChildren } from '../models/tasks';
import type { ITask } from '../api/tasks/types';
import type { IRoutine } from '../api/routines/types';

const PRIORITY_ORDER: Record<string, number> = { critical: 0, normal: 1, minor: 2 };

/**
 * Flat task list -> nested TaskWithChildren tree, sorted the way the Tasks
 * screen presents it: critical first, then tasks with children, recursively.
 *
 * Consolidated from feathy-journal-fe's Tasks page (which had the sort
 * duplicated for roots and children) and both TasksBrief copies of
 * buildTaskTree — one implementation, shared by every task list on both
 * platforms.
 */
export function buildTaskHierarchy(taskList: ITask[]): TaskWithChildren[] {
  const byId = new Map<string, TaskWithChildren>();
  taskList.forEach((task) => byId.set(task._id, { ...task, children: [] }));

  const roots: TaskWithChildren[] = [];
  taskList.forEach((task) => {
    const node = byId.get(task._id)!;
    if (task.parentId && byId.has(task.parentId)) {
      byId.get(task.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortLevel = (nodes: TaskWithChildren[]): TaskWithChildren[] =>
    nodes.sort((a, b) => {
      const ap = PRIORITY_ORDER[a.priority] ?? 1;
      const bp = PRIORITY_ORDER[b.priority] ?? 1;
      if (ap !== bp) return ap - bp;
      return (a.children.length > 0 ? 0 : 1) - (b.children.length > 0 ? 0 : 1);
    });

  const sortRecursively = (nodes: TaskWithChildren[]) => {
    sortLevel(nodes);
    nodes.forEach((n) => sortRecursively(n.children));
  };
  sortRecursively(roots);

  return roots;
}

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
