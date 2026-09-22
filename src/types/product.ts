export interface CreateProduct {
  name: string;
  description: string;
  quantity: number;
  picture: string;
  price: number;
  category_id: string;
}

export interface DeleteProductParams {
  id: string;
}
