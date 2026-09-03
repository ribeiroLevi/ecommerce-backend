import { users } from "../database/users.js";
import argon2 from "argon2";

interface LoginValidation {
  login: string;
  password: string;
}

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
}
