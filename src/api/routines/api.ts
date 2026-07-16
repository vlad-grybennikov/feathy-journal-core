import { apiClient } from '../client';
import { CreateRoutineRequest, UpdateRoutineRequest } from './types';
import { mapRoutinesResponse, mapRoutineResponse, RoutinesApiResponse, RoutineDetailApiResponse } from './mappers';

export const getRoutines = async () => {
  const response = await apiClient.get<RoutinesApiResponse>('/v1/routines');
  return mapRoutinesResponse(response.data);
};

export const getRoutineById = async (routineId: string) => {
  const response = await apiClient.get<RoutineDetailApiResponse>(`/v1/routines/${routineId}`);
  return mapRoutineResponse(response.data);
};

export const createRoutine = async (data: CreateRoutineRequest) => {
  const response = await apiClient.post<RoutineDetailApiResponse>('/v1/routines', data);
  return mapRoutineResponse(response.data);
};

export const updateRoutine = async (routineId: string, data: UpdateRoutineRequest) => {
  const response = await apiClient.put<RoutineDetailApiResponse>(`/v1/routines/${routineId}`, data);
  return mapRoutineResponse(response.data);
};

export const deleteRoutine = async (routineId: string) => {
  await apiClient.delete(`/v1/routines/${routineId}`);
};
