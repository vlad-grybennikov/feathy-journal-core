import { apiClient } from '../client';
import { GenerateTasksRequest, GenerateTasksResponse } from './types';
import { mapGenerateTasksResponse } from './mappers';

export const generateTasks = async (date: string) => {
  const request: GenerateTasksRequest = { date };
  const response = await apiClient.post<GenerateTasksResponse>('/v1/users/me/generate', request);
  return mapGenerateTasksResponse(response.data);
};
