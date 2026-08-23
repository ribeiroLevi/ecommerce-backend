import { FastifyInstance } from "fastify";
import { z } from "zod";
import { FastifyTypedInstanc } from "./types.js";
import { randomUUID } from "node:crypto";

interface User {
  id: string;
  name: string;
  email: string;
}

export async function routes(app: FastifyTypedInstanc) {
  const users = [];

  app.get("/user", () => {
    return [];
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
      },
    },
    (request, reply) => {
      const { name, email } = request.body;

      users.push({
        id: randomUUID(),
        name,
        email,
      });

      return reply.status(201).send();
    },
  );
}
