const express = require("express");
const db = require("../database");
// const { authenticateToken } = require("../utils/jwt");

const router = express.Router();

// // Käytä authenticateToken middlewarea kaikissa reiteissä tässä routerissa
// router.use(authenticateToken);

// GET /api/matches/
router.get("/", async (req, res) => {
  try {
    // Hae kaikki kilpailut tietokannasta, joissa käyttäjä on ollut mukana
    const matches = await db.query(
      `
      SELECT DISTINCT m.*
      FROM matches m
      JOIN match_participants mp ON m.id = mp.match_id
      WHERE mp.user_id = $1
      ORDER BY m.scheduled_time DESC
      `,
      [req.user.id]
    );

    res.json(matches.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Otteluiden hakemisessa tapahtui virhe" });
  }
});

// POST /api/matches/create
router.post("/create", async (req, res) => {
  const { match_name, scheduled_time } = req.body;
  try {
    // Lisätään ottelu tietokantaan
    const result = await db.query(
      `
      INSERT INTO matches (creator_id, match_name, scheduled_time)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [req.user.id, match_name || "Uusi ottelu", scheduled_time || null]
    );
    if (result.rows.length > 0) {
    }

    // Lisää luoja osallistujaksi (match_participants tauluun)
    const matchId = result.rows[0].id;
    await db.query(
      `
      INSERT INTO match_participants (match_id, user_id, role)
      VALUES ($1, $2, $3)
      `,
      [matchId, req.user.id, "creator"]
    );

    res.status(201).json({
      message: "Ottelu luotu onnistuneesti",
      match: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ottelua luodessa tapahtui virhe" });
  }
});

// POST /api/matches/join/:id
router.post("/join/:match_id", async (req, res) => {
  // Tarkista, että onko linkki oikea ja ottelu olemassa
  const { match_id } = req.params;
  if (!match_id) {
    return res.status(400).json({
      error:
        "Olet yrittämässä liittyä otteluun, mutta unohdit linkistä ottelun ID-tunnisteen",
    });
  }

  // Tarkista, onko käyttäjä kirjautunut
  const userId = req.user ? req.user.id : null;

  if (!userId) {
    return res
      .status(401)
      .json({ error: "Sinun tulee kirjautua tai rekisteröityä" });
  }

  // Tarkista, onko käyttäjä jo osallistuja
  const participantCheck = await db.query(
    "SELECT * FROM match_participants WHERE match_id = $1 AND user_id = $2",
    [match_id, userId]
  );

  if (participantCheck.rows.length > 0) {
    return res
      .status(400)
      .json({ error: "Olet jo osallistuja tässä ottelussa" });
  }
  try {
    // Lisää käyttäjä osallistujaksi roolilla "player"
    await db.query(
      `
    INSERT INTO match_participants (match_id, user_id, role)
    VALUES ($1, $2, 'player')
    `,
      [match_id, userId]
    );

    return res.status(200).json({ message: "Liitytty otteluun onnistuneesti" });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Ottelun liittymisessä tapahtui virhe" });
  }
});
// DELETE /api/matches/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const didCreator = await db.query(
    "SELECT creator_id FROM matches WHERE id = $1",
    [id]
  );
  // Tarkista, että ottelua löytyi
  if (didCreator.rows.length === 0) {
    return res.status(404).json({ error: "Ottelua ei löytynyt" });
  }

  // Tarkista, että käyttäjä on ottelun luoja
  if (didCreator.rows[0].creator_id !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Vain ottelun luoja voi poistaa ottelun" });
  }

  try {
    // Poistetaan ottelu tietokannasta
    await db.query("DELETE FROM matches WHERE id = $1", [id]);
    return res.status(200).json({ message: "Ottelu poistettu onnistuneesti" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ottelun poistamisessa tapahtui virhe" });
  }
});

module.exports = router;
