const request = require("supertest");
const { app, server } = require("../server");
const db = require("../database");

afterAll(async () => {
  await db.query("DELETE FROM users WHERE username = $1", [
    "uusi_testikäyttäjä_validilla_tokenilla",
  ]);
  await server.close();
  await db.pool.end();
});

let token;
describe("Autentikaation rajapinnan testaus", () => {
  // Rekisteröinti
  test("POST /api/auth/register - onnistunut rekisteröinti", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({ username: "testikäyttäjä", password: "testipass" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Käyttäjä luotu onnistuneesti"
    );
  });

  // Kirjautuminen
  test("POST /api/auth/login - onnistunut kirjautuminen", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({ username: "testikäyttäjä", password: "testipass" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    token = response.body.token;
  });
});

describe("Profiilin rajapinnan testaus", () => {
  // Profiilin haku ilman tokenia
  test("GET /api/user/profile - ei tokenia", async () => {
    const response = await request(app).get("/api/user/profile");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "error",
      "Pääsy evätty: Token puuttuu"
    );
  });
  // Profiilin haku validilla tokenilla
  test("GET /api/user/profile - onnistunut pyyntö", async () => {
    const response = await request(app)
      .get("/api/user/profile")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Profiilisi tiedot");
  });
  // Profiilin päivitys ilman tokenia
  test("PUT /api/user/profile - ei tokenia", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Content-Type", "application/json")
      .send({ newUsername: "uusi_testikäyttäjä_ilman_tokenia" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "error",
      "Pääsy evätty: Token puuttuu"
    );
  });
  // Profiilin päivitys validilla tokenilla
  test("PUT /api/user/profile - onnistunut pyyntö", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "uusi_testikäyttäjä_validilla_tokenilla" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Profiilisi tiedot päivitetty onnistuneesti"
    );
  });

  // Profiilin päivitys rajatapaus
  test("PUT /api/user/profile - uusi käyttäjänimi 3-50 merkkiä pitkä", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "a".repeat(51) });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Käyttäjänimen tulee olla 3-50 merkkiä pitkä"
    );
  });
  // Profiilin päivitys rajatapaus käyttäjänimi varattu
  // test("PUT /api/user/profile - käyttäjänimi jo käytössä", async () => {});
});
