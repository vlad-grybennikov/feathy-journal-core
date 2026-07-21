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
/** A Meal scheduled on a day. `slot` is the label ("Breakfast"); `mealId` is
 *  the Meal itself — distinctly named so they can't be confused. */
export interface IPlannedMeal {
  _id: string;
  userId: string;
  day: string;
  slot: string;
  mealId: string;
}

export const getFoodPlan = async (): Promise<IPlannedMeal[]> => {
  const res = await apiClient.get<{ data: IPlannedMeal[] }>('/v1/food/plan');
  return res.data.data ?? [];
};

export const createPlannedMeal = async (data: {
  day: string;
  mealId: string;
  slot?: string;
}): Promise<IPlannedMeal> => {
  const res = await apiClient.post<{ data: IPlannedMeal }>('/v1/food/plan', data);
  return res.data.data;
};

export const deletePlannedMeal = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/food/plan/${id}`);
};

/* ---------------- Trends (per-user, daily aggregates) ---------------- */

/** One logged day's macro totals. Days with nothing logged are absent, not zero. */
export interface IFoodTrendPoint {
  /** YYYY-MM-DD (UTC day, matching how logged-meal dates are stored). */
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Daily macro totals over the trailing window, ascending by date. Weight is
 * NOT here — it lives in measurements (`getMeasurements({ type: 'weight' })`),
 * fed by Oura/Apple.
 */
export const getFoodTrends = async (days = 14): Promise<IFoodTrendPoint[]> => {
  const res = await apiClient.get<{ data: IFoodTrendPoint[] }>('/v1/food/trends', {
    params: { days },
  });
  return res.data.data ?? [];
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
