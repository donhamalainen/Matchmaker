const express = require("express");
const db = require("../database");
const { authenticateToken } = require("../utils/jwt");

const router = express.Router();

// Käytä authenticateToken middlewarea kaikissa reiteissä tässä routerissa
router.use(authenticateToken);

// GET /api/tournaments/
router.get("/", async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Otteluiden hakemisessa tapahtui virhe" });
  }
});

// POST /api/tournaments/create
router.post("/create", async (req, res) => {
  const { tournament_name } = req.body;
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ottelua luodessa tapahtui virhe" });
  }
});

// POST /api/tournaments/join/:id
router.post("/join/:tournament_id", async (req, res) => {
  // Tarkista, että onko linkki oikea ja ottelu olemassa
  try {
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Ottelun liittymisessä tapahtui virhe" });
  }
});
// DELETE /api/tournaments/:id
router.delete("/:id", async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ottelun poistamisessa tapahtui virhe" });
  }
});

module.exports = router;
