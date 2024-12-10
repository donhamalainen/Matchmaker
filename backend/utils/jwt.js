const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "default_secret_key";

// Funktio JWT-tokenin luomiseen
function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "365d" }
  );
}

// Funktio JWT-tokenin tarkistamiseen
function verifyToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

// Middleware JWT-tokenin autentikointiin
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Pääsy evätty: Token puuttuu" });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token ei kelpaa" });
    }
    req.user = user;
    next();
  });
}

module.exports = {
  signToken,
  verifyToken,
  authenticateToken,
};
