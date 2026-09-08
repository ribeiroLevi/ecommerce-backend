import { randomUUID } from "node:crypto";
import { users } from "../database/users.js";
import { categories } from "../database/categories.js";
import { CreateCategory } from "../types/categories.js";

export class CategoriesService {
  async createCategory({ name, description }: CreateCategory) {
    const tempCategory = categories.find(
      (cat) => cat.name === name || cat.description === description,
    );

    if (tempCategory) {
      if (tempCategory.name === name) {
        throw new Error("This category name already exists");
      } else if (tempCategory.description === description) {
        throw new Error("This category description already exists");
      } else {
        throw new Error("Category already exists");
      }
    }

    const category = {
      id: randomUUID(),
      name,
      description,
    };

    categories.push(category);
    return category;
  }
}
