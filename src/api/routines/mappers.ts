import { IRoutine } from './types';

export interface RoutinesApiResponse {
  data: IRoutine[];
  status: number;
  success: boolean;
}

export interface RoutineDetailApiResponse {
  data: IRoutine;
  status: number;
  success: boolean;
}

export const mapRoutinesResponse = (response: RoutinesApiResponse): IRoutine[] => {
  if (!response.success || !response.data) {
    return [];
  }
  return response.data;
};

export const mapRoutineResponse = (response: RoutineDetailApiResponse): IRoutine => {
  return response.data;
};
