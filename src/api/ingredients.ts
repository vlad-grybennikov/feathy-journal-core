import { apiClient } from './client';

/**
 * Shared (global) ingredient — the atom. Covers USDA generic whole foods AND
 * branded products (a Snickers is an ingredient with a `brand` + `gtinUpc`).
 * Nutrition is per `ref` amount in `unit` (always per 100 g for USDA data).
 */
export interface IIngredient {
  _id: string;
  fdcId?: number | null;
  dataType?: 'sr_legacy' | 'foundation' | 'survey' | 'branded' | 'custom' | null;
  name: string;
  brand?: string | null;
  gtinUpc?: string | null;
  unit: string;
  ref: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number | null;
  sodium?: number | null;
}

export interface IngredientSearch {
  /** Name prefix. Required in practice — the collection holds ~2M rows. */
  q?: string;
  /** Fetch specific ingredients (e.g. resolving a meal's items). */
  ids?: string[];
  /** Exact barcode lookup. */
  barcode?: string;
  /** Capped at 100 server-side. */
  limit?: number;
}

/**
 * Search the ingredient DB. This NEVER returns the whole collection — with ~2M
 * rows the endpoint always limits, and generic foods rank above branded.
 */
export const getIngredients = async (params: IngredientSearch = {}): Promise<IIngredient[]> => {
  const res = await apiClient.get<{ data: IIngredient[] }>('/v1/ingredients', {
    params: {
      ...(params.q ? { q: params.q } : {}),
      ...(params.ids?.length ? { ids: params.ids.join(',') } : {}),
      ...(params.barcode ? { barcode: params.barcode } : {}),
      ...(params.limit ? { limit: params.limit } : {}),
    },
  });
  return res.data.data ?? [];
};

/** Resolve a specific set of ingredients by id (meal / log rendering). */
export const getIngredientsByIds = async (ids: string[]): Promise<IIngredient[]> =>
  ids.length ? getIngredients({ ids }) : [];
