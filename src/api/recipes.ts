import { apiClient } from './client';

export interface IRecipeIngredient {
  ingredientId: string;
  amount: number;
}

/** Shared (global) recipe, built from ingredients + a quantity. */
export interface IRecipe {
  _id: string;
  name: string;
  tag?: string | null;
  timeToCook?: number | null;
  servings: number;
  steps: string[];
  ingredients: IRecipeIngredient[];
}

export const getRecipes = async (): Promise<IRecipe[]> => {
  const res = await apiClient.get<{ data: IRecipe[] }>('/v1/recipes');
  return res.data.data ?? [];
};
