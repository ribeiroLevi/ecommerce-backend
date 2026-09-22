import { randomUUID } from "node:crypto";
import { products } from "../database/produtcs.js";
import { CreateProduct, UpdateProductDTO } from "../types/product.js";
import { prisma } from "../database/prisma.js";

export class ProductService {
  async executeCreateProduct({
    name,
    description,
    quantity,
    picture,
    price,
    category_id,
  }: CreateProduct) {
    const category = await prisma.categories.findUnique({
      where: {
        id: category_id,
      },
    });

    if (!category) {
      throw new Error("Category does not exist");
    }

    const tempProduct = await prisma.products.findUnique({
      where: {
        name,
      },
    });

    if (tempProduct) {
      const updatedProduct = await prisma.products.update({
        where: {
          id: tempProduct.id,
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });

      return updatedProduct;
    }

    const product = await prisma.products.create({
      data: {
        name,
        description,
        quantity,
        picture,
        price,
        category_id,
      },
    });

    return product;
  }

  async findProduct(id: string) {
    const product = await prisma.products.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new Error("Product does not exist");
    }

    return {
      ...product,
      price: Number(product.price),
    };
  }

  async updateProduct(data: UpdateProductDTO, id: string) {
    const product = await prisma.products.findUnique({
      where: {
        id: id,
      },
    });

    const updatedProduct = await prisma.products.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        picture: data.picture,
        price: data.price,
        category_id: data.category_id,
      },
    });
  }

  async executeList() {
    const productsDB = await prisma.products.findMany();
    return productsDB;
  }

  async deleteProduct(id: string) {
    const product = await prisma.products.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await prisma.products.delete({
      where: {
        id,
      },
    });
  }
}
