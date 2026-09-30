import { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "../services/products-services.js";
import {
  CreateProduct,
  DeleteProductParams,
  FindProductParams,
  PatchProductsParams,
  UpdateProductDTO,
  createProductSchema,
} from "../types/product.js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async createProduct(request: FastifyRequest, reply: FastifyReply) {
    const { name, description, quantity, price, category_id, picture } =
      request.body as {
        name: string;
        description: string;
        quantity: number;
        price: number;
        category_id: string;
        picture: Buffer;
      };

    const uploadDirectory = path.join(process.cwd(), "uploads", "products");

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const filename = `${crypto.randomUUID()}.jpg`;

    const filePath = path.join(uploadDirectory, filename);

    await writeFile(filePath, picture);

    const picturePath = `/uploads/products/${filename}`;

    const product = await this.productService.executeCreateProduct({
      name,
      description,
      quantity,
      price,
      category_id,
      picture: picturePath,
    });

    return reply.status(201).send(product);
  }

  async listProducts(reply: FastifyReply) {
    const products = await this.productService.executeList();
    return reply.status(200).send(products);
  }

  async findProduct(
    request: FastifyRequest<{ Params: FindProductParams }>,
    reply: FastifyReply,
  ) {
    try {
      const data = request.params;
      const product = await this.productService.findProduct(data.id);
      return reply.status(200).send(product);
    } catch (error) {
      if (error instanceof Error && error.message == "Product does not exist") {
        return reply.status(404).send({
          message: error.message,
        });
      }
      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  }

  async updateProduct(
    request: FastifyRequest<{
      Body: UpdateProductDTO;
      Params: PatchProductsParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const data = request.body;
      const params = request.params;
      await this.productService.updateProduct(data, params.id);
      return reply.status(200).send("Product Updated Sucessfully");
    } catch (error) {
      if (error instanceof Error && error.message == "Product does not exist") {
        return reply.status(404).send({
          message: error.message,
        });
      }
      console.log(error);
      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  }

  async deleteProduct(
    request: FastifyRequest<{ Params: DeleteProductParams }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      await this.productService.deleteProduct(id);
      return reply.status(200).send("Product Deleted Sucessfully");
    } catch (error) {
      if (error instanceof Error && error.message == "Product does not exist") {
        return reply.status(404).send({
          message: error.message,
        });
      }

      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  }
}
