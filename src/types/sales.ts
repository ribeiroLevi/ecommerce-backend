export interface SaleProduct {
  product_id: string;
  quantity: number;
}

export interface CreateSale {
  products: SaleProduct[];
}
