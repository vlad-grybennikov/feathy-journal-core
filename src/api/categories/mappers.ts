import { ICategory } from './types';

export interface CategoriesApiResponse {
  data: ICategory[];
  status: number;
  success: boolean;
}

export interface CategoryDetailApiResponse {
  data: ICategory;
  status: number;
  success: boolean;
}

export const mapCategoriesResponse = (response: CategoriesApiResponse): ICategory[] => {
  if (!response.success || !response.data) {
    return [];
  }
  return response.data;
};

export const mapCategoryResponse = (response: CategoryDetailApiResponse): ICategory => {
  return response.data;
};
