import {z} from "zod"
import { FastifyTypedInstanc } from "../types.js"
import { UserController } from "../controllers/user-controller.js"

const userController = new UserController();

export async function routes(app: FastifyTypedInstanc) {
  const users = [];

  app.get("/user", () => {
    userController.list.bind(userController)
  });

  app.post(
    "/user",
    {
      schema: {
        tags: ["users"],
        description: "Criação de Usuário",
        body: z.object({
          name: z.string(),
          email: z.email(),
        }),
        response:{
          201: z.object({
            id: z.uuid,
            name: z.string,
            email: z.email
          }),
          409: z.object({
            message: z.string()
          })
        },
      },
    },
    userController.create.bind(userController)
  );
}