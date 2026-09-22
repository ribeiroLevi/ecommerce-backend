import "dotenv/config";
import { randomUUID } from "node:crypto";

import { prisma } from "../database/prisma.js";
import { ProductService } from "../services/products-services.js";

const productService = new ProductService();

async function test() {
  const randomId = randomUUID().slice(0, 8);

  try {
    // =========================
    // FIND CATEGORY
    // =========================

    console.log("\n=== FIND CATEGORY ===");

    const category = await prisma.categories.findFirst();

    if (!category) {
      throw new Error("No category found in database");
    }

    console.log(category);

    // =========================
    // CREATE PRODUCT
    // =========================

    console.log("\n=== CREATE PRODUCT ===");

    const product = await productService.executeCreateProduct({
      name: `Test Vinyl ${randomId}`,
      description: "Vinyl created by integration test",
      price: 199.9,
      quantity: 5,
      picture: `test-${randomId}.jpg`,
      category_id: category.id,
    });

    console.log(product);

    // =========================
    // CHECK DATABASE
    // =========================

    console.log("\n=== CHECK DATABASE ===");

    const productFromDatabase = await prisma.products.findUnique({
      where: {
        id: product.id,
      },
    });

    if (!productFromDatabase) {
      throw new Error("Product was not found in database");
    }

    console.log(productFromDatabase);

    // =========================
    // TEST QUANTITY INCREMENT
    // =========================

    console.log("\n=== INCREMENT QUANTITY ===");

    const updatedProduct = await productService.executeCreateProduct({
      name: product.name,
      description: product.description,
      price: Number(product.price),
      quantity: 3,
      picture: product.picture ?? "test-picture.jpg",
      category_id: product.category_id,
    });

    console.log(updatedProduct);

    if (updatedProduct.quantity !== 8) {
      throw new Error(
        `Expected quantity 8, received ${updatedProduct.quantity}`,
      );
    }

    console.log("\nQuantity increment is working!");

    // =========================
    // DELETE TEST PRODUCT
    // =========================

    console.log("\n=== CLEANUP ===");

    await prisma.products.delete({
      where: {
        id: product.id,
      },
    });

    console.log("Test product deleted!");

    console.log("\n=== ALL TESTS PASSED ===");
  } catch (error) {
    console.error("\n=== TEST FAILED ===");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
