import "dotenv/config";
import { randomUUID } from "node:crypto";

import { UserService } from "../services/user-services.js";
import { AuthService } from "../services/auth-services.js";

const userService = new UserService();
const authService = new AuthService();

async function test() {
  const randomId = randomUUID().slice(0, 8);
  let createdUserId: string | undefined;

  const login = `auth-test-${randomId}`;
  const password = "123456";

  try {
    // =========================
    // CREATE USER
    // =========================

    console.log("\n=== CREATE USER ===");

    const user = await userService.executeCreate({
      name: `Auth Test ${randomId}`,
      email: `auth-${randomId}@test.com`,
      address: "Test Address",
      adm: false,
      login,
      password,
    });

    createdUserId = user.id;

    console.log({
      id: user.id,
      login: user.login,
      adm: user.adm,
    });

    // =========================
    // VALID LOGIN
    // =========================

    console.log("\n=== VALID LOGIN ===");

    const authenticatedUser = await authService.executeValidate({
      login,
      password,
    });

    console.log(authenticatedUser);

    if (authenticatedUser.id !== user.id) {
      throw new Error("Authenticated user ID does not match");
    }

    console.log("Valid login is working!");

    // =========================
    // GET CURRENT USER
    // =========================

    console.log("\n=== GET USER ===");

    const currentUser = await authService.executeGetUser(user.id);

    console.log(currentUser);

    if (currentUser.id !== user.id) {
      throw new Error("Current user ID does not match");
    }

    console.log("Get user is working!");

    // =========================
    // INVALID PASSWORD
    // =========================

    console.log("\n=== INVALID PASSWORD ===");

    try {
      await authService.executeValidate({
        login,
        password: "wrong-password",
      });

      throw new Error("Invalid password was accepted");
    } catch (error) {
      if (error instanceof Error && error.message === "Wrong Credentials") {
        console.log("Invalid password correctly rejected!");
      } else {
        throw error;
      }
    }

    // =========================
    // INVALID LOGIN
    // =========================

    console.log("\n=== INVALID LOGIN ===");

    try {
      await authService.executeValidate({
        login: `invalid-${randomId}`,
        password,
      });

      throw new Error("Invalid login was accepted");
    } catch (error) {
      if (error instanceof Error && error.message === "Wrong Credentials") {
        console.log("Invalid login correctly rejected!");
      } else {
        throw error;
      }
    }

    console.log("\n=== ALL AUTH TESTS PASSED ===");
  } catch (error) {
    console.error("\n=== TEST FAILED ===");
    console.error(error);
  } finally {
    // =========================
    // CLEANUP
    // =========================

    if (createdUserId) {
      console.log("\n=== CLEANUP ===");

      try {
        await userService.executeDelete(createdUserId);
        console.log("Test user deleted!");
      } catch (error) {
        console.error("Could not delete test user:");
        console.error(error);
      }
    }
  }
}

test();
