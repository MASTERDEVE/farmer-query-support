import express from "express";
import translate from "@vitalets/google-translate-api";

const router = express.Router();

router.post("/", async (req, res) => {
  const { text, lang } = req.body;
  try {
    const result = await translate(text, { to: lang });
    res.json({ translated: result.text });
  } catch (err) {
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
