import request from "supertest";
import dotenv from "dotenv";
dotenv.config({ path: `.env` });
import "../module-alias-setup";
import { connectDB } from "@/database/db";

let app: any;

beforeAll(async () => {
  await connectDB();
  // Skip loading app module in test context
  app = {}; // Placeholder for actual app instance
});

describe("Auth flows", () => {
  it("signup, login, check", async () => {
    const base = process.env.BACKEND_URL || "http://localhost:5001";
    const email = `test+${Date.now()}@example.com`;

    const signup = await request(base)
      .post("/api/users/auth/signup")
      .send({ name: "Test", email, password: "Passw0rd!" })
      .expect(201);

    expect(signup.body.success).toBeTruthy();

    const login = await request(base)
      .post("/api/users/auth/login")
      .send({ email, password: "Passw0rd!" })
      .expect(200);

    expect(login.body.token).toBeTruthy();

    const token = login.body.token;
    const check = await request(base)
      .get("/api/users/auth/check")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(check.body.success).toBeTruthy();
    expect(check.body.user.email).toBe(email);
  });
});
