import { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "../services/products-services.js";
import { CreateProduct, DeleteProductParams } from "../types/product.js";

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
      const { name, description, quantity, picture } = request.body;
      const product = await this.productService.executeCreateProduct({
        name,
        description,
        quantity,
        picture,
      });

      return reply.status(201).send();
    } catch (error) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }

  async listUser(reply: FastifyReply) {
    const users = await this.productService.executeList();
    return reply.status(200).send(users);
  }

  async deleteProduct(
    request: FastifyRequest<{ Params: DeleteProductParams }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      await this.productService.deleteProduct(id);
      return reply.status(200).send("User Deleted Sucessfully");
    } catch (error) {
      if (error instanceof Error && error.message == "User does not exist") {
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
