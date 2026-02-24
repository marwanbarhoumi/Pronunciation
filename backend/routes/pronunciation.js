const express = require("express");
const multer = require("multer");
const compare = require("../utils/compare");
const { speechToText } = require("../services/eleven.service");

const router = express.Router();
const upload = multer();

/* =========================
   ✅ DEMO EXERCISE (ثابت)
========================= */
const DEMO_EXERCISE = {
  id: 999999,
  correctSentence: "السلام عليكم، أنا أتدرّب على النطق اليوم."
};

/* =========================
   ✅ GET EXERCISE (ديما نفس الجملة)
========================= */
router.get("/exercise/:level", (req, res) => {
  res.json({ success: true, exercise: DEMO_EXERCISE });
});

/* =========================
   ✅ TEXT TO SPEECH (ElevenLabs)
========================= */
router.post("/generate-speech", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "No text provided"
      });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      console.error("❌ ELEVENLABS_API_KEY missing");
      return res.status(500).json({
        success: false,
        message: "API key missing"
      });
    }

    const axios = require("axios");

    const response = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
      {
        text,
        model_id: "eleven_multilingual_v2"
      },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
      }
    );

    res.set({ "Content-Type": "audio/mpeg" });
    res.send(response.data);
  } catch (error) {
    console.error(
      "🔥 ElevenLabs Pronunciation ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

/* =========================
   ✅ CHECK PRONUNCIATION (على نفس الجملة)
========================= */
router.post("/check", upload.single("audio"), async (req, res) => {
  try {
    const exerciseId = Number(req.body.exerciseId);

    const exercise = exerciseId === DEMO_EXERCISE.id ? DEMO_EXERCISE : null;

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "❌ التمرين غير موجود"
      });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        message: "❌ لم يتم إرسال الصوت"
      });
    }

    // 1) Speech To Text
    const studentText = await speechToText(req.file.buffer);

    // 2) Compare
    const result = compare(studentText, exercise.correctSentence);

    res.json({
      success: true,
      recognizedText: studentText,
      targetSentence: exercise.correctSentence,
      ...result
    });
  } catch (err) {
    console.error("Pronunciation check error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;