import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../database/prisma.js";

export async function requireAdminAuth(
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

  if (!user?.adm) {
    return reply.status(403).send({ message: "Forbidden" });
  }

  if (!user) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}
