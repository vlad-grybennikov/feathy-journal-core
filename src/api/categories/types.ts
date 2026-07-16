export interface ICategory {
  _id: string;
  userId: string;
  label: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  label: string;
  color: string;
}

export interface UpdateCategoryRequest {
  label?: string;
  color?: string;
}
