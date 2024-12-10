// Dotenv konfiguraatio
require("dotenv").config();

const express = require("express");
// const jwt = require("./utils/jwt");
const { authenticateToken } = require("./utils/jwt");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const matchesRoutes = require("./routes/matches.routes");

const app = express();

const port = process.env.PORT || 3000;

let refreshTokens = [];
// Middleware
app.use(express.json());
// app.use("/api/reset-token", (req, res) => {
//   const refreshToken = req.body.token;
//   if (refreshToken == null) {
//     return res.sendStatus(401);
//   }
//   if (!refreshTokens.includes(refreshToken)) {
//     return res.sendStatus(403);
//   }
//   jwt.verifyToken(
//     refreshToken,
//     process.env.REFRESH_TOKEN_SECRET,
//     (err, user) => {
//       if (err) return res.sendStatus(403);
//       const accessToken = jwt.signToken({ username: user.username });
//       res.json({ accessToken });
//     }
//   );
// });
// Reitit
app.use("/api/auth", authRoutes);
app.use("/api/user", authenticateToken, userRoutes);
app.use("/api/matches", authenticateToken, matchesRoutes);

// Palvelin käynnistys
const server = app.listen(port, "0.0.0.0", () =>
  console.log(`Server running on 0.0.0.0:${port}`)
);

module.exports = {
  app,
  server,
};
