const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database");
const { signToken } = require("../utils/jwt");

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // Tarkista, että käyttäjänimi ja salasana on annettu
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Käyttäjänimi ja salasana ovat pakollisia" });
  }

  try {
    // Hae käyttäjä tietokannasta
    const userResult = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Väärä käyttäjänimi tai salasana" });
    }

    // Vertaile annettua salasanaa ja tietokantaan tallennettua hashattua salasanaa
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Väärä käyttäjänimi tai salasana" });
    }

    // Luo JWT-token
    const token = signToken(user);
    console.log({
      token,
      id: user.id,
      username: user.username,
      password_hash: user.password_hash,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
    res.status(200).json({ message: "Kirjautuminen onnistui", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Palvelinvirhe" });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tarkista, että käyttäjänimi ja salasana on annettu
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Käyttäjänimi ja salasana ovat pakollisia" });
    }

    // Tarkista, onko käyttäjänimi jo käytössä
    const userExists = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "Käyttäjänimi on jo käytössä" });
    }

    // Hashaa salasana
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tallenna uusi käyttäjä tietokantaan
    const result = await db.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hashedPassword]
    );

    console.log(result.rows[0]);
    res
      .status(201)
      .json({ message: "Käyttäjä luotu onnistuneesti", user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Käyttäjän rekisteröinnissä tapahtuivirhe" });
  }
});

module.exports = router;
