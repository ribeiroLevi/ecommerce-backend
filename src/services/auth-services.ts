import argon2 from "argon2";
import { LoginValidation } from "../types/auth.js";
import { prisma } from "../database/prisma.js";

export class AuthService {
  async executeValidate({ login, password }: LoginValidation) {
    const tempUser = await prisma.users.findUnique({
      where: {
        login,
      },
    });

    if (!tempUser) {
      throw new Error("Wrong Credentials");
    }

    const isPasswordCorrect = await argon2.verify(tempUser.password, password);

    if (!isPasswordCorrect) {
      throw new Error("Wrong Credentials");
    }

    return {
      id: tempUser.id,
      login: tempUser.login,
      adm: tempUser.adm,
    };
  }

  async executeGetUser(userId: string) {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      login: user.login,
      adm: user.adm,
    };
  }
}
