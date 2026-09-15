export interface CreateProduct {
  name: string;
  description: string;
  quantity: number;
  picture: string;
}

export interface DeleteProductParams {
  id: string;
}
