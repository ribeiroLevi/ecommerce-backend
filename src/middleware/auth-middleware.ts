import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../database/prisma.js";

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}
