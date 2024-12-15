const express = require("express");
const db = require("../database");
const { authenticateToken } = require("../utils/jwt");

const router = express.Router();

// Käytä authenticateToken middlewarea kaikissa reiteissä tässä routerissa
router.use(authenticateToken);

// GET /api/user/profile
router.get("/profile", async (req, res) => {
  try {
    res.json({ message: "Profiilisi tiedot", user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Palvelinvirhe" });
  }
});

// PUT /api/user/profile
router.put("/profile", async (req, res) => {
  const { username } = req.body;

  try {
  } catch (error) {
    console.error("Virhe profiilin päivittämisessä:", error);
    res.status(500).json({ error: "Virhe profiilin päivittämisessä" });
  }
});

module.exports = router;
