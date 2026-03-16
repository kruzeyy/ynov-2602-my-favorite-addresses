import request from "supertest";
import app from "./app";
import datasource from "./datasource";

/** Infos du compte créé, utilisées par les tests de connexion et GET /me */
let createdUser: {
  email: string;
  password: string;
  token: string;
};

beforeAll(async () => {
  await datasource.initialize();
});

afterAll(async () => {
  await datasource.destroy();
});

describe("App MFP - création de compte", () => {
  it("crée un compte utilisateur avec email test@test.com et mot de passe supersecret", async () => {
    const email = "test@test.com";
    const password = "supersecret";

    const res = await request(app)
      .post("/api/users")
      .send({ email, password })
      .expect(200);

    expect(res.body).toHaveProperty("item");
    expect(res.body.item).toMatchObject({ email });
    expect(res.body.item).not.toHaveProperty("hashedPassword");
    expect(res.body.item).toHaveProperty("id");
    expect(res.body.item).toHaveProperty("createdAt");

    createdUser = { email, password, token: "" };
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

describe("App MFP - connexion et profil", () => {
  it("connecte l'utilisateur (POST /api/users/tokens)", async () => {
    const res = await request(app)
      .post("/api/users/tokens")
      .send({ email: createdUser.email, password: createdUser.password })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    createdUser.token = res.body.token;
  });

  it("récupère le profil de l'utilisateur connecté (GET /api/users/me)", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${createdUser.token}`)
      .expect(200);

    expect(res.body).toHaveProperty("item");
    expect(res.body.item).toMatchObject({ email: createdUser.email });
    expect(res.body.item).not.toHaveProperty("hashedPassword");
    expect(res.body.item).toHaveProperty("id");
    expect(res.body.item).toHaveProperty("createdAt");
  });
});
