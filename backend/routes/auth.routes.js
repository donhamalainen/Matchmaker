const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database");
const { signToken } = require("../utils/jwt");
const generateOTP = require("../utils/otp");

const router = express.Router();

// POST /api/auth/request
router.post("/request", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ error: "Sähköposti on pakollinen" });

  try {
    const userData = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = userData.rows[0];

    // OTP
    const otp = generateOTP();
    //
    if (user) {
      await db.query("UPDATE users SET otp_verify = $1 WHERE email = $2", [
        otp,
        email,
      ]);
    } else {
      // Create a new user
      await db.query("INSERT INTO users (email, otp_verify) VALUES ($1, $2)", [
        email,
        otp,
      ]);
    }
    // Send OTP to the user's email
    await sendEmailOTP(email, otp);

    res.status(200).json({ message: "OTP lähetetty sähköpostiin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Virhe OTP-koodin lähetyksessä" });
  }
});

// POST /api/auth/verify
router.post("/verify", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ error: "Sähköposti ja OTP ovat pakollisia" });
  try {
    // Tarkista käyttäjä ja OTP tietokannasta
    const userData = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = userData.rows[0];

    if (!user)
      return res
        .status(404)
        .json({ error: "Virheellinen sähköposti tai käyttäjää ei ole luotu" });

    if (user.otp_verify !== otp || new Date() > new Date(user.otp_expire)) {
      return res
        .status(401)
        .json({ error: "OTP on virheellinen tai vanhentunut" });
    }

    // Päivitä käyttäjän sähköposti varmennetuksi
    await db.query("UPDATE users SET email_verified = TRUE WHERE email = $1", [
      email,
    ]);

    // Luo JWT-token käyttäjälle
    const token = signToken(user);
    res.status(200).json({ message: "Kirjautuminen onnistui", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Virhe OTP:n tarkistuksessa" });
  }
});

module.exports = router;
