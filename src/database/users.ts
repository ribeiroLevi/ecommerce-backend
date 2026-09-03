import { randomUUID } from "node:crypto";

export const users: Array<{
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
