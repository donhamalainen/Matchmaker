// Dotenv konfiguraatio
require("dotenv").config();
const express = require("express");
const { authenticateToken } = require("./utils/jwt");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const matchesRoutes = require("./routes/matches.routes");
const tournamentsRoutes = require("./routes/tournaments.routes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware

app.use(express.json());
// Reitit
app.use("/api/auth", authRoutes);
app.use("/api/user", authenticateToken, userRoutes);
app.use("/api/matches", authenticateToken, matchesRoutes);
app.use("api/tournaments", authenticateToken, tournamentsRoutes);

// Palvelin käynnistys
const server = app.listen(port, "0.0.0.0", () =>
  console.log(`Server running on 0.0.0.0:${port}`)
);

module.exports = {
  app,
  server,
};
