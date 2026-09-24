import z from "zod";
import { FastifyTypedInstanc } from "../types/fastify.js";
import { requireAuth } from "../middleware/auth-middleware.js";
import { SalesController } from "../controllers/sale-controller.js";
import { requireAdminAuth } from "../middleware/adminauth-middleware.js";

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

  app.delete(
    "/sale/:id",
    {
      preHandler: requireAdminAuth,
      schema: {
        tags: ["Sales"],
        description: "Deleção de Vendas",
        params: z.object({ id: z.uuid() }),
        response: {
          200: z.object({
            id: z.string(),
          }),
        },
      },
    },
    (request, reply) => salesController.deleteSale(request, reply),
  );

  app.get(
    "/sale",
    {
      preHandler: requireAdminAuth,
      schema: {
        tags: ["Sales"],
        description: "Retornar todas as compras do sistemas para usuários ADM",
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
