import { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "../services/products-services.js";
import { CreateProduct } from "../types/product.js";

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
}
