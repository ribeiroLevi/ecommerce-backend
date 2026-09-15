import { FastifyTypedInstanc } from "../types/fastify.js";
import { z } from "zod";
import { AuthController } from "../controllers/auth-controller.js";

const authController = new AuthController();

export async function authRoutes(app: FastifyTypedInstanc) {
  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["auth"],
        description: "Valida a tentativa de login.",
        body: z.object({
          login: z.string(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            login: z.string(),
            adm: z.boolean(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    authController.validateUser.bind(authController),
  );

  app.get(
    "/auth/me",
    {
      schema: {
        tags: ["auth"],
        description:
          "Retorno o ID do usuário atual na sessão a partir de Cookie de sessão",
        response: {
          200: z.object({
            id: z.string(),
            //login: z.string(),
            //adm: z.boolean(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    authController.currentUser.bind(authController),
  );

  app.post(
    "/auth/logout",
    {
      schema: {
        tags: ["auth"],
        description: "Destrói a sessão do usuário atual",
      },
    },
    authController.logoutUser.bind(authController),
  );
}
