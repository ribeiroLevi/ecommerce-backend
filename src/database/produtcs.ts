import { randomUUID } from "node:crypto";

export const products: Array<{
  id: string;
  name: string;
  description: string;
  quantity: number;
  picture: string;
}> = [
  {
    id: randomUUID(),
    name: "Blusa",
    description: "Blusa Bonita Insider",
    quantity: 2,
    picture: "url",
  },
];
