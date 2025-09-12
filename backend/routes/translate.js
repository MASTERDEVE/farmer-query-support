import express from "express";
import translate from "@vitalets/google-translate-api"; // lightweight translation lib

const router = express.Router();

// POST /api/translate
router.post("/", async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ message: "Text and targetLang are required" });
    }

    const result = await translate(text, { to: targetLang });

    res.json({
      original: text,
      translated: result.text,
      targetLang,
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ message: "Translation failed" });
  }
});

export default router;
