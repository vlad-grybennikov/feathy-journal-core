import { apiClient } from '../client';
import { CreateCategoryRequest, UpdateCategoryRequest } from './types';
import {
  mapCategoriesResponse,
  mapCategoryResponse,
  CategoriesApiResponse,
  CategoryDetailApiResponse,
} from './mappers';

export const getCategories = async () => {
  const response = await apiClient.get<CategoriesApiResponse>('/v1/categories');
  return mapCategoriesResponse(response.data);
};

export const createCategory = async (data: CreateCategoryRequest) => {
  const response = await apiClient.post<CategoryDetailApiResponse>('/v1/categories', data);
  return mapCategoryResponse(response.data);
};

export const updateCategory = async (categoryId: string, data: UpdateCategoryRequest) => {
  const response = await apiClient.put<CategoryDetailApiResponse>(`/v1/categories/${categoryId}`, data);
  return mapCategoryResponse(response.data);
};

export const deleteCategory = async (categoryId: string) => {
  await apiClient.delete(`/v1/categories/${categoryId}`);
};
