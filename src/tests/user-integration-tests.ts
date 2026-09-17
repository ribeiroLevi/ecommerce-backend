import "dotenv/config";
import { randomUUID } from "node:crypto";
import { UserService } from "../services/user-services.js";

const userService = new UserService();

async function test() {
  const randomId = randomUUID().slice(0, 8);

  let createdUserId: string | undefined;

  try {
    // =========================
    // CREATE
    // =========================

    console.log("\n=== CREATE ===");

    const createdUser = await userService.executeCreate({
      name: `Test User ${randomId}`,
      email: `test-${randomId}@test.com`,
      address: "Test Address",
      adm: false,
      login: `test-${randomId}`,
      password: "123456",
    });

    createdUserId = createdUser.id;

    console.log(createdUser);

    // =========================
    // LIST
    // =========================

    console.log("\n=== LIST ===");

    const users = await userService.executeList();

    console.log(users);

    // =========================
    // FIND
    // =========================

    console.log("\n=== FIND ===");

    const foundUser = await userService.findUser(createdUser.id);

    console.log(foundUser);

    // =========================
    // UPDATE
    // =========================

    console.log("\n=== UPDATE ===");

    const updatedUser = await userService.updateUser(
      {
        name: `Updated User ${randomId}`,
        address: "Updated Address",
      },
      createdUser.id,
    );

    console.log(updatedUser);

    // =========================
    // DELETE
    // =========================

    console.log("\n=== DELETE ===");

    await userService.executeDelete(createdUser.id);

    createdUserId = undefined;

    console.log("User deleted successfully!");

    // =========================
    // FINISHED
    // =========================

    console.log("\n=== ALL TESTS PASSED ===");
  } catch (error) {
    console.error("\n=== TEST FAILED ===");
    console.error(error);
  } finally {
    // Se algum teste falhar depois do CREATE,
    // tenta remover o usuário criado.

    if (createdUserId) {
      console.log("\n=== CLEANUP ===");

      try {
        await userService.executeDelete(createdUserId);

        console.log("Test user removed.");
      } catch (error) {
        console.error("Could not remove test user:");
        console.error(error);
      }
    }
  }
}

test();
