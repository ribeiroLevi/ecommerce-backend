import { z } from "zod";
import { FastifyTypedInstanc } from "../types.js";
import { UserController } from "../controllers/user-controller.js";
import { request } from "node:http";

const userController = new UserController();

export async function routes(app: FastifyTypedInstanc) {
  app.get(
    "/listusers",
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

  app.delete(
    "/deleteuser",
    {
      schema: {
        tags: ["user"],
        description: "Deleção de Usuários",
        body: z.object({ id: z.uuid() }),
        response: {
          200: z.object({
            id: z.string(),
          }),
        },
      },
    },
    (request, reply) => userController.deleteUser(request, reply),
  );

  app.post(
    "/createuser",
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
