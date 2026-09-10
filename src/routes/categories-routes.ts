import { request } from "node:http";
import { string, z } from "zod";
import { CategoryController } from "../controllers/categories-controller.js";
import { FastifyTypedInstanc } from "../types/fastify.js";
import { Schema } from "zod/v3";
import { id } from "zod/locales";

const categoryController = new CategoryController();

export async function categoryRoutes(app: FastifyTypedInstanc) {
  app.get(
    "/category",
    {
      schema: {
        tags: ["category"],
        description: "Lista as Categorias Disponíveis",
      },
    },
    (request, reply) => {
      return categoryController.listCategories(request, reply);
    },
  );

  app.delete(
    "/category/:id",
    {
      schema: {
        tags: ["category"],
        description: "Deleção de Categorias",
        params: z.object({ id: z.uuid() }),
        response: {
          200: z.object({
            id: z.string(),
          }),
        },
      },
    },
    (request, reply) => categoryController.deleteCategory(request, reply),
  );

  app.post(
    "/category",
    {
      schema: {
        tags: ["category"],
        description: "Criação de Categoria",
        body: z.object({
          name: z.string(),
          description: z.string(),
        }),
        response: {
          201: z.object({
            name: z.string(),
            description: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    categoryController.createCategory.bind(categoryController),
  );
}
