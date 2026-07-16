import { GenerateTasksResponse } from './types';

export const mapGenerateTasksResponse = (response: GenerateTasksResponse): unknown => {
  if (!response.success) {
    throw new Error('Failed to generate tasks');
  }
  return response.data;
};
