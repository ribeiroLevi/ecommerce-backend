export interface CreateProduct {
  name: string;
  description: string;
  quantity: number;
  picture: string;
  price: number;
}

export interface DeleteProductParams {
  id: string;
}
