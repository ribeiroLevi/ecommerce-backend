import { randomUUID } from "node:crypto";
import { users } from "../database/users.js";
import { categories } from "../database/categories.js";
import { CreateCategory, UpdateCategory } from "../types/categories.js";

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

  async executeListCategories() {
    return categories;
  }

  async deleteCategory(id: string) {
    const categoryPosition = categories.findIndex(
      (category) => category.id === id,
    );

    if (categoryPosition === -1) {
      throw new Error("Category does not exist");
    }

    categories.splice(categoryPosition, 1);
    return categories;
  }

  async updateCategory(data: UpdateCategory, id: string) {
    const categoryPosition = categories.findIndex(
      (category) => category.id === id,
    );
    const currentCategory = categories[categoryPosition];

    const updatedCategory = {
      ...currentCategory,
      ...data,
    };

    if (categoryPosition === -1) {
      throw new Error("Category does not exist");
    }

    categories[categoryPosition] = updatedCategory;

    return updatedCategory;
  }
}
