import { log } from "node:console";
import { randomUUID } from "node:crypto";

interface UserDTO {
  name: string;
  email: string;
  address: string;
  adm: boolean;
  login: string;
  password: string;
}

interface UpdateUserDTO {
  name?: string;
  email?: string;
  address?: string;
  adm?: boolean;
  login?: string;
  password?: string;
}

const users: Array<{
  id: string;
  name: string;
  email: string;
  address: string;
  adm: boolean;
  login: string;
  password: string;
}> = [
  {
    id: randomUUID(),
    name: "João",
    email: "joao@teste.org.com",
    address: "saasdfasdfasdf",
    adm: false,
    login: "joao",
    password: "asdasdfasdf",
  },
  {
    id: randomUUID(),
    name: "maria",
    email: "maria@teste.org.com",
    address: "saasdfasdfasdf",
    adm: false,
    login: "maria",
    password: "asdasdfasdf",
  },
];

export class UserService {
  async executeCreate({ name, email, address, adm, login, password }: UserDTO) {
    const userAlreadyExists = users.find(
      (user) => user.email === email || user.login === login,
    );

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const user = {
      id: randomUUID(),
      name,
      email,
      address,
      adm,
      login,
      password,
    };

    users.push(user);
    return user;
  }

  async executeList() {
    return users;
  }

  async deleteUser(id: string) {
    const userPosition = users.findIndex((user) => user.id === id);

    if (userPosition === -1) {
      throw new Error("User does not exist");
    }

    users.splice(userPosition, 1);
    return users;
  }

  async findUser(login: string) {
    const userPosition = users.findIndex((user) => user.login === login);

    if (userPosition === -1) {
      throw new Error("User does not exist");
    }

    const currentUser = users[userPosition];

    return currentUser;
  }

  async updateUser(data: UpdateUserDTO, id: string) {
    const userPosition = users.findIndex((user) => user.id === id);
    const currentUser = users[userPosition];

    const updatedUser = {
      ...currentUser,
      ...data,
    };

    if (userPosition === -1) {
      throw new Error("User does not exist");
    }

    users[userPosition] = updatedUser;

    return updatedUser;
  }
}
