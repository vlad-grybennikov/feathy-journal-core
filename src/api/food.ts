import { apiClient } from './client';

/* ---------------- Log (per-user) ---------------- */
export interface ILoggedItem {
  _id: string;
  name: string;
  serving?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micros?: Record<string, string> | null;
}

export interface ILoggedMeal {
  _id: string;
  userId: string;
  date: string;
  name: string;
  time?: string | null;
  items: ILoggedItem[];
}

export interface ItemInput {
  name: string;
  serving?: string | null;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  micros?: Record<string, string> | null;
}

export interface MealInput {
  date: string;
  name: string;
  time?: string | null;
  items?: ItemInput[];
}

export const getFoodLog = async (date: string): Promise<ILoggedMeal[]> => {
  const res = await apiClient.get<{ data: ILoggedMeal[] }>('/v1/food/log', { params: { date } });
  return res.data.data ?? [];
};

export const createMeal = async (data: MealInput): Promise<ILoggedMeal> => {
  const res = await apiClient.post<{ data: ILoggedMeal }>('/v1/food/log', data);
  return res.data.data;
};

export const updateMeal = async (id: string, data: Partial<MealInput>): Promise<ILoggedMeal> => {
  const res = await apiClient.put<{ data: ILoggedMeal }>(`/v1/food/log/${id}`, data);
  return res.data.data;
};

export const deleteMeal = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/food/log/${id}`);
};

/* ---------------- Plan (per-user) ---------------- */
export interface IPlannedMeal {
  _id: string;
  userId: string;
  day: string;
  meal: string;
  recipeId: string;
}

export const getFoodPlan = async (): Promise<IPlannedMeal[]> => {
  const res = await apiClient.get<{ data: IPlannedMeal[] }>('/v1/food/plan');
  return res.data.data ?? [];
};

export const createPlannedMeal = async (data: {
  day: string;
  recipeId: string;
  meal?: string;
}): Promise<IPlannedMeal> => {
  const res = await apiClient.post<{ data: IPlannedMeal }>('/v1/food/plan', data);
  return res.data.data;
};

export const deletePlannedMeal = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/food/plan/${id}`);
};

/* ---------------- Targets (per-user) ---------------- */
export interface INutritionTarget {
  _id: string;
  userId: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

export const getTargets = async (): Promise<INutritionTarget> => {
  const res = await apiClient.get<{ data: INutritionTarget }>('/v1/food/targets');
  return res.data.data;
};

export const updateTargets = async (
  data: Partial<Omit<INutritionTarget, '_id' | 'userId'>>,
): Promise<INutritionTarget> => {
  const res = await apiClient.put<{ data: INutritionTarget }>('/v1/food/targets', data);
  return res.data.data;
};
