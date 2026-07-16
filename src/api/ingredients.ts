import { apiClient } from './client';

/** Shared (global) ingredient — nutrition per `ref` amount in `unit`. */
export interface IIngredient {
  _id: string;
  name: string;
  unit: string;
  ref: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number | null;
  sodium?: number | null;
}

export const getIngredients = async (): Promise<IIngredient[]> => {
  const res = await apiClient.get<{ data: IIngredient[] }>('/v1/ingredients');
  return res.data.data ?? [];
};
