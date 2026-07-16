import { ITask } from './types';

export interface TaskApiResponse {
  data: ITask[];
  status: number;
  success: boolean;
}

export interface TaskDetailApiResponse {
  data: ITask;
  status: number;
  success: boolean;
}

export const mapTasksResponse = (response: TaskApiResponse): ITask[] => {
  if (!response.success || !response.data) {
    return [];
  }
  return response.data;
};

export const mapTaskResponse = (response: TaskDetailApiResponse): ITask => {
  return response.data;
};
