import { FastifyReply, FastifyRequest } from "fastify";
import { CreateSale } from "../types/sales.js";
import { SaleService } from "../services/sale-services.js";

export class SalesController {
  private salesService: SaleService;

  constructor() {
    this.salesService = new SaleService();
  }

  async createSale(
    request: FastifyRequest<{ Body: CreateSale }>,
    reply: FastifyReply,
  ) {
    try {
      const { products } = request.body;
      const userId = request.session.userId!;

      const sale = await this.salesService.executeCreateSale({
        userId,
        products,
      });
      return reply.status(201).send({ sale_id: sale.id });
    } catch (error) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }
}
