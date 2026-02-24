const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://pronunciation-mauve.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // يسمح Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    }
  })
);

/* =========================
   ROUTES
========================= */
const pronunciationRoutes = require("./routes/pronunciation");

app.use("/api/pronunciation", pronunciationRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("✅ API running");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});