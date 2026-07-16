import { apiClient } from './client';

/** Shared (global) searchable food database item. */
export interface IFood {
  _id: string;
  name: string;
  serving?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const getFoods = async (q?: string): Promise<IFood[]> => {
  const res = await apiClient.get<{ data: IFood[] }>('/v1/foods', { params: q ? { q } : undefined });
  return res.data.data ?? [];
};
