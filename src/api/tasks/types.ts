import { DateString } from '../common/types';
import { Priority } from '../common/enums';

export interface ITask {
  _id: string;
  name: string;
  isDone: boolean;
  userId: string;
  parentId: string | null;
  date: DateString;
  routineId: string | null;
  time: number | null; // Duration in seconds
  priority: Priority; // Priority level
  category?: string | null; // Category id (color-coded); optional/legacy-safe
  autoTransfer: boolean; // Auto-transfer to next day if not done
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  name: string;
  date: DateString;
  parentId?: string | null;
  time?: number | null;
  priority?: Priority;
  category?: string | null;
  autoTransfer?: boolean;
}

export interface UpdateTaskRequest {
  name?: string;
  date?: DateString;
  parentId?: string | null;
  isDone?: boolean;
  time?: number | null;
  priority?: Priority;
  category?: string | null;
  autoTransfer?: boolean;
}

export interface GetTasksParams {
  date?: DateString;
}
