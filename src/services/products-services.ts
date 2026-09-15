import { randomUUID } from "node:crypto";
import { products } from "../database/produtcs.js";
import { CreateProduct } from "../types/product.js";

export class ProductService {
  async executeCreateProduct({
    name,
    description,
    quantity,
    picture,
  }: CreateProduct) {
    const tempProduct = products.find((product) => product.name === name);

    if (tempProduct) {
      tempProduct.quantity += quantity;
      return tempProduct;
    }

    const newProduct = {
      id: randomUUID(),
      name,
      description,
      picture,
      quantity,
    };

    products.push(newProduct);
    return newProduct;
  }
}
