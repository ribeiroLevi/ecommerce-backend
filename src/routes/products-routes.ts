import z from "zod";
import { FastifyTypedInstanc } from "../types/fastify.js";
import { id } from "zod/locales";
import { ProductController } from "../controllers/products-controller.js";

export async function productRoutes(app: FastifyTypedInstanc) {
  const productController = new ProductController();

  app.post(
    "/product",
    {
      schema: {
        tags: ["Products"],
        description: "Cria um novo produto",
        body: z.object({
          name: z.string(),
          description: z.string(),
          quantity: z.string(),
          picture: z.string(),
        }),
        response: {
          201: z.object({
            id: z.uuid(),
            name: z.string(),
          }),
        },
      },
    },
    productController.createProduct.bind(productController),
  );
}
