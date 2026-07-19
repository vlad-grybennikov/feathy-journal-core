import { apiClient } from './client';

export interface IMealItem {
  ingredientId: string;
  amount: number;
}

/**
 * A shared (global) meal: a named bundle of ingredients, eaten whole — so it
 * carries no servings/yield. A meal that needs cooking has a `Recipe` pointing
 * at it (see recipes.ts).
 */
export interface IMeal {
  _id: string;
  name: string;
  tag?: string | null;
  ingredients: IMealItem[];
}

export interface MealDefInput {
  name?: string;
  tag?: string | null;
  ingredients?: IMealItem[];
}

export const getMeals = async (): Promise<IMeal[]> => {
  const res = await apiClient.get<{ data: IMeal[] }>('/v1/meals');
  return res.data.data ?? [];
};

export const getMeal = async (id: string): Promise<IMeal> => {
  const res = await apiClient.get<{ data: IMeal }>(`/v1/meals/${id}`);
  return res.data.data;
};

export const createMealDef = async (data: MealDefInput): Promise<IMeal> => {
  const res = await apiClient.post<{ data: IMeal }>('/v1/meals', data);
  return res.data.data;
};

export const updateMealDef = async (id: string, data: MealDefInput): Promise<IMeal> => {
  const res = await apiClient.put<{ data: IMeal }>(`/v1/meals/${id}`, data);
  return res.data.data;
};

/** Deleting a meal deletes its recipe too. */
export const deleteMealDef = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/meals/${id}`);
};
