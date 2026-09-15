export interface CreateCategory {
  name: string;
  description: string;
}

export interface DeleterCategoryParams {
  id: string;
}

export interface UpdateCategory {
  id: string;
  name?: string;
  description?: string;
}
