import { apiClient } from './client';
import type { IMeal } from './meals';

/**
 * A Recipe is a Meal + how to cook it. The ingredients live on the meal, so a
 * recipe only adds `instructions` + `timeToCook` — a meal needing no cooking
 * (a banana) simply has no recipe. `mealId` is populated on reads.
 */
export interface IRecipe {
  _id: string;
  mealId: IMeal | string;
  instructions?: string | null;
  timeToCook?: number | null;
}

export interface RecipeInput {
  mealId?: string;
  instructions?: string | null;
  timeToCook?: number | null;
}

/** Narrow the populated `mealId` — reads populate it, writes send a bare id. */
export const recipeMeal = (r: IRecipe): IMeal | null =>
  typeof r.mealId === 'object' && r.mealId !== null ? (r.mealId as IMeal) : null;

export const getRecipes = async (): Promise<IRecipe[]> => {
  const res = await apiClient.get<{ data: IRecipe[] }>('/v1/recipes');
  return res.data.data ?? [];
};

export const getRecipe = async (id: string): Promise<IRecipe> => {
  const res = await apiClient.get<{ data: IRecipe }>(`/v1/recipes/${id}`);
  return res.data.data;
};

export const createRecipe = async (data: RecipeInput): Promise<IRecipe> => {
  const res = await apiClient.post<{ data: IRecipe }>('/v1/recipes', data);
  return res.data.data;
};

export const updateRecipe = async (id: string, data: RecipeInput): Promise<IRecipe> => {
  const res = await apiClient.put<{ data: IRecipe }>(`/v1/recipes/${id}`, data);
  return res.data.data;
};

export const deleteRecipe = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/recipes/${id}`);
};
