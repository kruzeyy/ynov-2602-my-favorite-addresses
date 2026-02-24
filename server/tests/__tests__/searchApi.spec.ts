import request from "supertest";
import app from "../searchApi";

describe("POST /count - intégration", () => {
  it("retourne le nombre d'occurrences du mot dans le texte", async () => {
    const res = await request(app)
      .post("/count")
      .send({ text: "Le chat mange. Le chien mange aussi.", word: "mange" })
      .expect(200);

    expect(res.body).toEqual({ count: 2 });
  });

  it("retourne 0 quand le mot n'apparaît pas", async () => {
    const res = await request(app)
      .post("/count")
      .send({ text: "Hello world", word: "foo" })
      .expect(200);

    expect(res.body).toEqual({ count: 0 });
  });

  it("est insensible à la casse", async () => {
    const res = await request(app)
      .post("/count")
      .send({ text: "Test TEST test", word: "test" })
      .expect(200);

    expect(res.body).toEqual({ count: 3 });
  });

  it("répond 400 si text ou word manquent ou ne sont pas des chaînes", async () => {
    await request(app).post("/count").send({}).expect(400);
    await request(app)
      .post("/count")
      .send({ text: "hi", word: 123 })
      .expect(400);
  });
});
