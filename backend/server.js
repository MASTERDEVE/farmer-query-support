import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import multer from "multer";

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

// Validate environment variables
const requiredEnvVars = ["AZURE_OPENAI_ENDPOINT", "AZURE_OPENAI_DEPLOYMENT", "AZURE_OPENAI_API_KEY", "AZURE_OPENAI_API_VERSION"];
requiredEnvVars.forEach(v => {
  if (!process.env[v]) throw new Error(`Missing env var: ${v}`);
});

// ✅ Text chat route
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ reply: "Please type something to chat!" });

  try {
    const response = await fetch(
      `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: message.trim() }],
          max_tokens: 200,
        }),
      }
    );

    if (!response.ok) {
      console.error("Azure API error:", response.status);
      return res.status(500).json({ reply: "⚠️ AI service error. Try again later." });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I didn't get that.";
    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ reply: "⚠️ Connection error with AI service." });
  }
});

// ✅ Image recognition route
app.post("/api/recognize", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ result: "No image uploaded" });

    const imageBase64 = req.file.buffer.toString("base64");

    const response = await fetch(
      `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Describe this image in detail for a farmer." },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
                },
              ],
            },
          ],
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      console.error("Azure Vision API error:", response.status);
      return res.status(500).json({ result: "⚠️ AI image recognition error." });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "Sorry, I couldn't analyze that image.";
    res.json({ result });
  } catch (err) {
    console.error("Image recognition error:", err);
    res.status(500).json({ result: "⚠️ Error processing image." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
