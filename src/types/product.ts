import z from "zod";

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

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  quantity?: number;
  picture?: string;
  price?: number;
  category_id?: string;
}

export interface FindProductParams {
  id: string;
}

export interface PatchProductsParams {
  id: string;
}

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().positive(),
  category_id: z.uuid(),
});
