import { prisma } from "../database/prisma.js";
import { CreateCategory, UpdateCategory } from "../types/categories.js";

export class CategoriesService {
  async createCategory({ name, description }: CreateCategory) {
    const tempCategory = await prisma.categories.findFirst({
      where: {
        OR: [{ name }, { description }],
      },
    });

    if (tempCategory) {
      if (tempCategory.name === name) {
        throw new Error("This category name already exists");
      }

      if (tempCategory.description === description) {
        throw new Error("This category description already exists");
      }
    }

    const category = await prisma.categories.create({
      data: {
        name,
        description,
      },
    });

    return category;
  }

  async executeListCategories() {
    const categories = await prisma.categories.findMany();

    return categories;
  }

  async deleteCategory(id: string) {
    const category = await prisma.categories.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new Error("Category does not exist");
    }

    await prisma.categories.delete({
      where: {
        id,
      },
    });

    return category;
  }

  async updateCategory(data: UpdateCategory, id: string) {
    const category = await prisma.categories.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new Error("Category does not exist");
    }

    const updatedCategory = await prisma.categories.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return updatedCategory;
  }
}
