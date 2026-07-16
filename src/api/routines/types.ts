import { Priority } from '../common/enums';

export interface IRoutine {
  _id: string;
  name: string;
  userId: string;
  parentId: string | null;
  rrule: string;
  isActive: boolean;
  time: number | null; // Duration in seconds
  priority: Priority; // Priority level
  category?: string | null; // Category id (color-coded); optional/legacy-safe
  autoTransfer: boolean; // Auto-transfer to next day if not done
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoutineRequest {
  name: string;
  rrule: string;
  parentId?: string | null;
  isActive?: boolean;
  time?: number | null;
  priority?: Priority;
  category?: string | null;
  autoTransfer?: boolean;
}

export interface UpdateRoutineRequest {
  name?: string;
  rrule?: string;
  parentId?: string | null;
  isActive?: boolean;
  time?: number | null;
  priority?: Priority;
  category?: string | null;
  autoTransfer?: boolean;
}
