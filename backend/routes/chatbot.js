import express from "express";
import Faq from "../models/Faq.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        answer: "Please enter a question.",
      });
    }

    const faq = await Faq.findOne({
      question: new RegExp(query.trim(), "i"),
    });

    if (faq) {
      return res.json({
        success: true,
        answer: faq.answer,
        source: "FAQ",
      });
    }

    return res.json({
      success: true,
      answer:
        "I couldn't find this question in the FAQ database. Please try asking the AI agricultural assistant.",
      source: "AI_FALLBACK",
    });
  } catch (error) {
    console.error("FAQ chatbot error:", error);

    return res.status(500).json({
      success: false,
      answer: "Unable to process your question right now.",
    });
  }
});

export default router;