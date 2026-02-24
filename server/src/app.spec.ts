import request from "supertest";
import app from "./app";
import datasource from "./datasource";

beforeAll(async () => {
  await datasource.initialize();
});

afterAll(async () => {
  await datasource.destroy();
});

describe("App MFP - création de compte", () => {
  it("crée un compte utilisateur avec email test@test.com et mot de passe supersecret", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "test@test.com", password: "supersecret" })
      .expect(200);

    expect(res.body).toHaveProperty("item");
    expect(res.body.item).toMatchObject({ email: "test@test.com" });
    expect(res.body.item).not.toHaveProperty("hashedPassword");
    expect(res.body.item).toHaveProperty("id");
    expect(res.body.item).toHaveProperty("createdAt");
  });

  it("crée un compte utilisateur avec email et mot de passe aléatoires (faker-js)", async () => {
    const { faker } = await import("@faker-js/faker");
    const email = faker.internet.email();
    const password = faker.internet.password({ minLength: 8 });

    const res = await request(app)
      .post("/api/users")
      .send({ email, password })
      .expect(200);

    expect(res.body).toHaveProperty("item");
    expect(res.body.item).toMatchObject({ email });
    expect(res.body.item).not.toHaveProperty("hashedPassword");
    expect(res.body.item).toHaveProperty("id");
    expect(res.body.item).toHaveProperty("createdAt");
  });
});
