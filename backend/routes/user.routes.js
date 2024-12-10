const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database");
const { authenticateToken } = require("../utils/jwt");
const router = express.Router();

// // Käytä authenticateToken middlewarea kaikissa reiteissä tässä routerissa
router.use(authenticateToken);

// GET /api/user/profile
router.get("/profile", async (req, res) => {
  try {
    // Hae käyttäjän tiedot tietokannasta käyttäen req.user.id
    res.json({ message: "Profiilisi tiedot", user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Palvelinvirhe" });
  }
});

// MUISTA LISÄTÄ SÄHKÖPOSTIPÄVITYS

// PUT /api/user/profile
router.put("/profile", async (req, res) => {
  const { newUsername, newPassword, currentPassword } = req.body;

  // Tarkista, että joko newUsername tai newPassword on annettu
  if (!newUsername && !newPassword) {
    return res
      .status(400)
      .json({ error: "Uusi käyttäjänimi tai salasana on annettava" });
  }

  try {
    // Aloita päivityskenttien kerääminen
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Käsittele käyttäjänimen päivitys
    if (newUsername) {
      // Validoi uusi käyttäjänimi
      if (
        typeof newUsername !== "string" ||
        newUsername.length < 3 ||
        newUsername.length > 50
      ) {
        return res.status(400).json({
          error: "Käyttäjänimen tulee olla 3-50 merkkiä pitkä",
        });
      }
      if (!/^[a-zA-ZäöåÄÖÅ0-9_]+$/.test(newUsername)) {
        return res.status(400).json({
          error:
            "Käyttäjänimi saa sisältää vain kirjaimia, numeroita ja alaviivoja",
        });
      }

      // Tarkista, onko uusi käyttäjänimi jo käytössä
      const userExists = await db.query(
        "SELECT id FROM users WHERE username = $1 AND id != $2",
        [newUsername, req.user.id]
      );
      if (userExists.rows.length > 0) {
        return res.status(409).json({ error: "Käyttäjänimi on jo käytössä" });
      }

      fields.push(`username = $${paramIndex}`);
      values.push(newUsername);
      paramIndex++;
    }

    // Käsittele salasanan päivitys
    if (newPassword) {
      // Tarkista, että currentPassword on annettu
      if (!currentPassword) {
        return res.status(400).json({
          error: "Nykyinen salasana on pakollinen salasanan vaihtamiseksi",
        });
      }

      // Hae käyttäjän tallennettu salasana tietokannasta
      const userResult = await db.query(
        "SELECT password_hash FROM users WHERE id = $1",
        [req.user.id]
      );
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ error: "Käyttäjää ei löydy" });
      }

      // Vertaile annettua nykyistä salasanaa tallennettuun salasanaan
      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password_hash
      );
      if (!validPassword) {
        return res
          .status(401)
          .json({ error: "Nykyinen salasana on virheellinen" });
      }

      // Validoi uusi salasana
      if (typeof newPassword !== "string" || newPassword.length < 6) {
        return res.status(400).json({
          error: "Salasanan tulee olla vähintään 6 merkkiä pitkä",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      fields.push(`password_hash = $${paramIndex}`);
      values.push(hashedPassword);
      paramIndex++;
    }

    // Varmista, että päivitettäviä kenttiä on
    if (fields.length === 0) {
      return res
        .status(400)
        .json({ error: "Uusi käyttäjänimi tai salasana on annettava" });
    }

    // Lisää käyttäjän id parametrien joukkoon
    values.push(req.user.id);

    // Rakenna ja suorita päivityskysely
    const updateQuery = `UPDATE users SET ${fields.join(
      ", "
    )} WHERE id = $${paramIndex}`;
    await db.query(updateQuery, values);

    res
      .status(200)
      .json({ message: "Profiilisi tiedot päivitetty onnistuneesti" });
  } catch (error) {
    console.error("Virhe profiilin päivittämisessä:", error);
    res.status(500).json({ error: "Virhe profiilin päivittämisessä" });
  }
});

module.exports = router;
