import { apiClient } from '../client';
import { CreateTaskRequest, UpdateTaskRequest, ITask, GetTasksParams } from './types';
import { mapTasksResponse, mapTaskResponse, TaskApiResponse, TaskDetailApiResponse } from './mappers';

export const getTasks = async (params?: GetTasksParams) => {
  const response = await apiClient.get<TaskApiResponse>('/v1/tasks', { params });
  return mapTasksResponse(response.data);
};

export const createTask = async (data: CreateTaskRequest): Promise<ITask> => {
  const response = await apiClient.post<TaskDetailApiResponse>('/v1/tasks', data);
  return mapTaskResponse(response.data);
};

export const updateTask = async (taskId: string, data: UpdateTaskRequest) => {
  const response = await apiClient.put<TaskDetailApiResponse>(`/v1/tasks/${taskId}`, data);
  return mapTaskResponse(response.data);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await apiClient.delete(`/v1/tasks/${taskId}`);
};

export const autoTransferTasks = async (date: string): Promise<void> => {
  await apiClient.post(`/v1/tasks/auto-transfer`, { date });
};
