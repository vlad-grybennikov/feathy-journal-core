'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  getCategories,
  createCategory as createCategoryApi,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
  ICategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../api';
import { useAuth } from './AuthContext';

interface CategoryMeta {
  label: string;
  color: string;
}

interface CategoriesContextValue {
  categories: ICategory[];
  byId: Record<string, ICategory>;
  /** Resolve a category id to its label + color, or null if unset/unknown. */
  getMeta: (id?: string | null) => CategoryMeta | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  createCategory: (data: CreateCategoryRequest) => Promise<ICategory>;
  updateCategory: (id: string, data: UpdateCategoryRequest) => Promise<ICategory>;
  deleteCategory: (id: string) => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined);

/**
 * Loads the user's categories once and shares them across the picker, cards,
 * and Settings manager. The backend seeds a default set on first load.
 */
export const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setCategories(await getCategories());
    } catch {
      // Non-fatal: cards simply render without a category dot.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      refresh();
    } else {
      setCategories([]);
      setIsLoading(false);
    }
  }, [user, refresh]);

  const byId = useMemo(
    () => Object.fromEntries(categories.map((c) => [c._id, c])) as Record<string, ICategory>,
    [categories],
  );

  const getMeta = useCallback(
    (id?: string | null): CategoryMeta | null => {
      const c = id ? byId[id] : undefined;
      return c ? { label: c.label, color: c.color } : null;
    },
    [byId],
  );

  const createCategory = useCallback(async (data: CreateCategoryRequest) => {
    const created = await createCategoryApi(data);
    setCategories((prev) => [...prev, created]);
    return created;
  }, []);

  const updateCategory = useCallback(async (id: string, data: UpdateCategoryRequest) => {
    const updated = await updateCategoryApi(id, data);
    setCategories((prev) => prev.map((c) => (c._id === id ? updated : c)));
    return updated;
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await deleteCategoryApi(id);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  }, []);

  const value = useMemo(
    () => ({
      categories,
      byId,
      getMeta,
      isLoading,
      refresh,
      createCategory,
      updateCategory,
      deleteCategory,
    }),
    [categories, byId, getMeta, isLoading, refresh, createCategory, updateCategory, deleteCategory],
  );

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};

export const useCategories = (): CategoriesContextValue => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return ctx;
};
