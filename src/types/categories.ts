export interface CreateCategory {
  name: string;
  description: string;
}

export interface DeleterCategoryParams {
  id: string;
}

export interface UpdateCategory {
  name?: string;
  description?: string;
}
