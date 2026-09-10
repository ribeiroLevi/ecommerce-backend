import { randomUUID } from "node:crypto";

export const categories: Array<{
  id: string;
  name: string;
  description: string;
}> = [
  {
    id: randomUUID(),
    name: "Exemplo",
    description: "Exemplo2",
  },
];
