import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/auth-services.js";

interface ValidateUser {
  login: string;
  password: string;
}

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async validateUser(
    request: FastifyRequest<{ Body: ValidateUser }>,
    reply: FastifyReply,
  ) {
    try {
      const login = request.body.login;
      const password = request.body.password;

      const user = await this.authService.executeValidate({
        login,
        password,
      });

      return reply.status(200).send(user);
    } catch (error) {
      if (error instanceof Error && error.message === "Wrong Credentials") {
        return reply.status(401).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }
}
