import { users } from "../database/users.js";
import argon2 from "argon2";
import { LoginValidation } from "../types/auth.js";

export class AuthService {
  async executeValidate({ login, password }: LoginValidation) {
    const tempUser = users.find((user) => user.login === login);

    if (!tempUser) {
      throw new Error("Wrong Credentials");
    }

    const isPasswordCorrect = await argon2.verify(tempUser.password, password);

    if (isPasswordCorrect) {
      return { id: tempUser.id, login: tempUser.login, adm: tempUser.adm };
    }
    throw new Error("Wrong Credentials");
  }

  async executeGetUser(userId: string) {
    const user = users.find((user) => user.id === userId);

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
