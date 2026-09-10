import { FastifyReply, FastifyRequest } from "fastify";
import { CategoriesService } from "../services/categories-services.js";
import {
  CreateCategory,
  DeleterCategoryParams,
  UpdateCategory,
} from "../types/categories.js";

export class CategoryController {
  private categoriesService: CategoriesService;

  constructor() {
    this.categoriesService = new CategoriesService();
  }

  async createCategory(
    request: FastifyRequest<{ Body: CreateCategory }>,
    reply: FastifyReply,
  ) {
    try {
      const { name, description } = request.body;

      const category = await this.categoriesService.createCategory({
        name,
        description,
      });
      return reply.status(201).send(category);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message == "This category name already exists" ||
          error.message === "This category description already exists")
      ) {
        return reply.status(409).send({ message: error.message });
      } else {
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  }

  async listCategories(request: FastifyRequest, reply: FastifyReply) {
    const categories = await this.categoriesService.executeListCategories();
    return reply.status(200).send(categories);
  }

  async deleteCategory(
    request: FastifyRequest<{ Params: DeleterCategoryParams }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      await this.categoriesService.deleteCategory(id);
      return reply.status(200).send("Category Deleted Sucessfully");
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Category does not exist"
      ) {
        return reply.status(404).send({
          message: error.message,
        });
      }
      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  }

  async updateCategory(
    request: FastifyRequest<{ Body: UpdateCategory }>,
    reply: FastifyReply,
  ) {
    try {
      const data = request.body;
      await this.categoriesService.updateCategory(data, data.id);
      return reply.status(200).send("Category Updated Sucessfully");
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Category does not exist"
      ) {
        return reply.status(400).send({
          message: error.message,
        });
      }

      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  }
}
