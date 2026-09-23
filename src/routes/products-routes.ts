import z, { string } from "zod";
import { FastifyTypedInstanc } from "../types/fastify.js";
import { ProductController } from "../controllers/products-controller.js";
import { requireAuth } from "../middleware/auth-middleware.js";

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
          quantity: z.number(),
          picture: z.string(),
          category_id: string(),
          price: z.number(),
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

  app.get(
    "/product",
    {
      schema: {
        tags: ["Products"],
        description: "Listagem de Produtos",
      },
    },
    (request, reply) => {
      return productController.listProducts(reply);
    },
  );

  app.delete(
    "/product/:id",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Products"],
        description: "Deleção de Produtos",
        params: z.object({ id: z.uuid() }),
        response: {
          200: z.object({
            id: z.string(),
          }),
        },
      },
    },
    (request, reply) => productController.deleteProduct(request, reply),
  );

  app.get(
    "/product/:id",
    {
      schema: {
        tags: ["Products"],
        description: "Busca um produto",
        params: z.object({ id: z.string() }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            price: z.number(),
            picture: z.string().nullable(),
            quantity: z.number(),
            category_id: z.string(),
          }),
        },
      },
    },
    (request, reply) => {
      return productController.findProduct(request, reply);
    },
  );

  app.patch(
    "/product/:id",
    {
      schema: {
        tags: ["Products"],
        description: "Atualização de Produtos",
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          quantity: z.number().optional(),
          picture: z.string().optional(),
          price: z.number().optional(),
          category_id: z.string().optional(),
        }),
        response: {
          200: z.object({
            id: z.string(),
          }),
        },
      },
    },
    (request, reply) => productController.updateProduct(request, reply),
  );
}
