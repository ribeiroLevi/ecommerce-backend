import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../services/user-services.js";
import { ca } from "zod/locales";

interface CreateUserBody {
  name: string;
  email: string;
  address: string;
  adm: boolean;
  login: string;
  password: string;
}

interface DeleteUserParams {
  id: string;
}

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(
    request: FastifyRequest<{ Body: CreateUserBody }>,
    reply: FastifyReply,
  ) {
    try {
      const { name, email, address, adm, login, password } = request.body;
      const user = await this.userService.executeCreate({
        name,
        email,
        address,
        adm,
        login,
        password,
      });

      return reply.status(201).send(user);
    } catch (error) {
      if (error instanceof Error && error.message == "User already exists") {
        return reply.status(409).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }

  async listUser(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.userService.executeList();
    return reply.status(200).send(users);
  }

  async deleteUser(
    request: FastifyRequest<{ Body: DeleteUserParams }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.body;
      await this.userService.deleteUser(id);
      return reply.status(200).send("User Deleted Sucessfully");
    } catch (error) {
      if (error instanceof Error && error.message == "User Does Not Exist") {
        return reply.status(404).send({
          message: error.message,
        });
      }

      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  }
}
