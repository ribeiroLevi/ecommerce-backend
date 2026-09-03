import { string, z } from "zod";
import { FastifyTypedInstanc } from "../types.js";
import { UserController } from "../controllers/user-controller.js"; 

const userController = new UserController();

export async function routes(app: FastifyTypedInstanc) {
  app.get(
    "/user",
    {
      schema: {
        tags: ["users"],
        description: "Listagem de Usuários",
      },
    },
    (request, reply) => {
      return userController.listUser(request, reply);
    },
  );

  app.get(
    "/user/:login",
    {
      schema: {
        tags: ["users"],
        description: "Busca um usuário",
        params: z.object({ login: z.string() }),
        response: {
          200: z.object({
            id: string(),
          }),
        },
      },
    },
    (request, reply) => {
      return userController.findUser(request, reply);
    },
  );

  app.delete(
    "/user/:id",
    {
      schema: {
        tags: ["users"],
        description: "Deleção de Usuários",
        params: z.object({ id: z.uuid() }),
        response: {
          200: z.object({
            id: z.string(),
          }),
        },
      },
    },
    (request, reply) => userController.deleteUser(request, reply),
  );

  app.patch(
    "/user:id",
    {
      schema: {
        tags: ["users"],
        description: "Atualização de Usuários",
        body: z.object({
          id: z.uuid(),
          name: z.string().optional(),
          email: z.email().optional(),
          address: z.string().optional(),
          login: z.string().optional(),
          password: z.string().optional(),
          adm: z.boolean().optional(),
        }),
        response: {
          200: z.object({
            id: z.string(),
          }),
        },
      },
    },
    (request, reply) => userController.updateUser(request, reply),
  );

  app.post(
    "/user",
    {
      schema: {
        tags: ["users"],
        description: "Criação de Usuário",
        body: z.object({
          name: z.string(),
          email: z.email(),
          address: z.string(),
          login: z.string(),
          password: z.string(),
          adm: z.boolean(),
        }),
        response: {
          201: z.object({
            id: z.uuid(),
            name: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    userController.createUser.bind(userController),
  );
}
