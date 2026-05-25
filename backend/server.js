import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Use the correct export name for your package

dotenv.config();

const app = express();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["POST", "GET"],
  })
);

// Validate Gemini Environment Key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing env var: GEMINI_API_KEY");
}

// Initialize the Google Generative AI client correctly
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Base Health Check Route
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    service: "Farmer Query Support System API (Powered by Google Gemini)",
    endpoints: ["POST /chat", "POST /api/recognize"]
  });
});

// ✅ Text chat route
// ✅ Corrected Text chat route
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ reply: "Please type something to chat!" });

  try {
    // Forcing the classic, globally supported text engine
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(message.trim());
    const reply = result.response.text() || "Sorry, I didn't get that.";
    
    res.json({ reply });
  } catch (err) {
    console.error("Gemini Chat error:", err);
    res.status(500).json({ reply: "⚠️ Connection error with Google Gemini service." });
  }
});

// ✅ Corrected Image recognition route
app.post("/api/recognize", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ result: "No image uploaded" });

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype
      },
    };

    const prompt = "Describe this image in detail for a farmer.";

    // Forcing the classic vision engine
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text() || "Sorry, I couldn't analyze that image.";

    res.json({ result: responseText });
  } catch (err) {
    console.error("Gemini Image recognition error:", err);
    res.status(500).json({ result: "⚠️ Error processing image through Gemini Vision API." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));