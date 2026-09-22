import { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "../services/products-services.js";
import {
  CreateProduct,
  DeleteProductParams,
  FindProductParams,
  PatchProductsParams,
  UpdateProductDTO,
} from "../types/product.js";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async createProduct(
    request: FastifyRequest<{ Body: CreateProduct }>,
    reply: FastifyReply,
  ) {
    try {
      const { name, description, quantity, picture, price, category_id } =
        request.body;
      const product = await this.productService.executeCreateProduct({
        name,
        description,
        quantity,
        picture,
        price,
        category_id,
      });

      return reply.status(201).send();
    } catch (error) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
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
