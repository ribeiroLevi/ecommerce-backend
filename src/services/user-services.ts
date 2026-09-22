import { randomUUID } from "node:crypto";
import argon2 from "argon2";
import { CreateUserDTO, UpdateUserDTO } from "../types/user.js";

import { prisma } from "../database/prisma.js";
export class UserService {
  async executeCreate({
    name,
    email,
    address,
    adm,
    login,
    password,
  }: CreateUserDTO) {
    const tempUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { login }],
      },
    });

    if (tempUser) {
      if (tempUser.email == email) {
        throw new Error("Email already in use");
      } else if (tempUser.login === login) {
        throw new Error("Username already in use");
      } else {
        throw new Error("User already exists");
      }
    }

    const passwordHash = await argon2.hash(password);

    const user = await prisma.users.create({
      data: { name, email, address, adm, login, password: passwordHash },
    });

    return user;
  }

  async executeList() {
    const users2 = await prisma.users.findMany();
    return users2;
  }

  async executeDelete(id: string) {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.users.delete({
      where: {
        id,
      },
    });
  }

  async findUser(id: string) {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        login: true,
        adm: true,
      },
    });

    if (!user) {
      throw new Error("User does not exist");
    }

    return user;
  }

  async updateUser(data: UpdateUserDTO, id: string) {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error("User does not exist");
    }

    let passwordHash: string | undefined;

    if (data.password) {
      passwordHash = await argon2.hash(data.password);
    }

    const updatedUser = await prisma.users.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        email: data.email,
        address: data.address,
        adm: data.adm,
        login: data.login,
        password: passwordHash,
      },
    });

    return updatedUser;
  }
}
