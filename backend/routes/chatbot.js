import express from "express";
import Faq from "../models/Faq.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { query } = req.body;
  const faq = await Faq.findOne({ question: new RegExp(query, "i") });
  if (faq) {
    res.json({ answer: faq.answer });
  } else {
    res.json({ answer: "Forwarding to expert... (demo response)" });
  }
});

export default router;
