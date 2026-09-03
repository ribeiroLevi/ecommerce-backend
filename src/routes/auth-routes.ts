import { id } from "zod/locales";
import { FastifyTypedInstanc } from "../types.js";
import { string, z } from "zod";
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
            name: z.string(),
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
}
