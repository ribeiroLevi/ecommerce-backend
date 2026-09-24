import { FastifyReply, FastifyRequest } from "fastify";
import { CreateSale, DeleteSaleParams } from "../types/sales.js";
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

  async listUserSales(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.session.userId!;

    const products = await this.salesService.getUserSales(userId);

    return reply.status(200).send(products);
  }

  async listAllSales(request: FastifyRequest, reply: FastifyReply) {
    const sales = await this.salesService.listAllSales();
    return reply.status(200).send(sales);
  }

  async deleteSale(
    request: FastifyRequest<{ Params: DeleteSaleParams }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      await this.salesService.deleteSale(id);
      return reply.status(200).send("Sale Deleted Sucessfully");
    } catch (error) {
      if (error instanceof Error && error.message == "Sale not ") {
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
