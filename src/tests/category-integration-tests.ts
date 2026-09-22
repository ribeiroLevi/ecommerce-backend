import "dotenv/config";
import { randomUUID } from "node:crypto";

import { CategoriesService } from "../services/categories-services.js";

const categoriesService = new CategoriesService();

async function test() {
  const randomId = randomUUID().slice(0, 8);
  let createdCategoryId: string | undefined;

  try {
    // =========================
    // CREATE
    // =========================

    console.log("\n=== CREATE CATEGORY ===");

    const category = await categoriesService.createCategory({
      name: `Test Category ${randomId}`,
      description: `Test description ${randomId}`,
    });

    createdCategoryId = category.id;

    console.log(category);

    // =========================
    // LIST
    // =========================

    console.log("\n=== LIST CATEGORIES ===");

    const categories = await categoriesService.executeListCategories();

    console.log(categories);

    const categoryExists = categories.some(
      (item) => item.id === createdCategoryId,
    );

    if (!categoryExists) {
      throw new Error("Created category was not found in list");
    }

    console.log("Category found in list!");

    // =========================
    // UPDATE
    // =========================

    console.log("\n=== UPDATE CATEGORY ===");

    const updatedCategory = await categoriesService.updateCategory(
      {
        name: `Updated Category ${randomId}`,
        description: `Updated description ${randomId}`,
      },
      createdCategoryId,
    );

    console.log(updatedCategory);

    if (updatedCategory.name !== `Updated Category ${randomId}`) {
      throw new Error("Category name was not updated");
    }

    if (updatedCategory.description !== `Updated description ${randomId}`) {
      throw new Error("Category description was not updated");
    }

    console.log("Category updated successfully!");

    // =========================
    // DELETE
    // =========================

    console.log("\n=== DELETE CATEGORY ===");

    const deletedCategory =
      await categoriesService.deleteCategory(createdCategoryId);

    console.log(deletedCategory);

    createdCategoryId = undefined;

    console.log("Category deleted successfully!");

    // =========================
    // DELETE NON-EXISTENT
    // =========================

    console.log("\n=== DELETE NON-EXISTENT CATEGORY ===");

    try {
      await categoriesService.deleteCategory(randomUUID());

      throw new Error("Non-existent category was deleted");
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Category does not exist"
      ) {
        console.log("Non-existent category correctly rejected!");
      } else {
        throw error;
      }
    }

    console.log("\n=== ALL CATEGORY TESTS PASSED ===");
  } catch (error) {
    console.error("\n=== TEST FAILED ===");
    console.error(error);
  } finally {
    // =========================
    // CLEANUP
    // =========================

    if (createdCategoryId) {
      console.log("\n=== CLEANUP ===");

      try {
        await categoriesService.deleteCategory(createdCategoryId);
        console.log("Test category removed!");
      } catch (error) {
        console.error("Could not remove test category:");
        console.error(error);
      }
    }
  }
}

test();
