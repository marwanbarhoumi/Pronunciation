const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());

// CORS (بدّل origin حسب دومين الفرونت متاعك)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://your-frontend.vercel.app" // بدّلها ولا احذفها
    ],
    credentials: true
  })
);

/* =========================
   ROUTES
========================= */
const pronunciationRoutes = require("./routes/pronunciation"); 
// ⚠️ بدّل المسار حسب مشروعك: ./routes/pronunciationRoutes مثلا

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
  console.log(`✅ Server running on http://localhost:${PORT}`);
});