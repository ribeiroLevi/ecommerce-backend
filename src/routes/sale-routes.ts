import z from "zod";
import { FastifyTypedInstanc } from "../types/fastify.js";
import { requireAuth } from "../middleware/auth-middleware.js";
import { SalesController } from "../controllers/sale-controller.js";

export async function saleRoutes(app: FastifyTypedInstanc) {
  const salesController = new SalesController();

  app.get(
    "/sale/me",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Sales"],
        description: "Retorna as compras do usuário logado",
      },
    },
    salesController.listUserSales.bind(salesController),
  );

  app.post(
    "/sale",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Sales"],
        description: "Realiza uma compra",
        body: z.object({
          products: z
            .array(
              z.object({
                product_id: z.uuid(),
                quantity: z.number().int().positive(),
              }),
            )
            .min(1),
        }),

        response: {
          201: z.object({
            sale_id: z.uuid(),
          }),
        },
      },
    },
    salesController.createSale.bind(salesController),
  );
}
