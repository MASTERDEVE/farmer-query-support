import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

/* =========================================================
   CONFIGURATION
========================================================= */

const PORT = process.env.PORT || 5000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing env var: GEMINI_API_KEY");
}

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  bodyParser.json({
    limit: "20kb",
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["POST", "GET"],
  })
);

/* =========================================================
   MULTER CONFIGURATION
========================================================= */

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(
        new Error(
          "Invalid image format. Please upload JPG, PNG, or WEBP."
        )
      );
    }

    cb(null, true);
  },
});

/* =========================================================
   AI SYSTEM INSTRUCTION
========================================================= */

const SYSTEM_INSTRUCTION = `
You are an AI Agricultural Assistant for the Farmer Query Support System.

Your role is to provide practical, simple, and responsible agricultural guidance.

You can help with:
- Crop cultivation
- Soil health
- Irrigation
- Fertilizers
- Pest management
- Crop diseases
- Weather-related farming precautions
- Basic farming practices

IMPORTANT RULES:

1. Use simple language that farmers can understand.
2. Consider the crop, location, language, and weather information when provided.
3. Do not invent government schemes, chemical names, dosages, or agricultural facts.
4. If you are uncertain, clearly say that the information should be verified with a local agricultural expert.
5. Do not claim that an AI response is a guaranteed diagnosis.
6. For pesticide or fertilizer recommendations, encourage users to follow the product label and local agricultural guidance.
7. If the question is unrelated to agriculture, politely redirect the user toward farming-related topics.
8. Keep answers practical and concise.
`;

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

// Create Gemini model from one place
function getGeminiModel() {
  return ai.getGenerativeModel({
    model: GEMINI_MODEL,
  });
}

// Build contextual agricultural prompt
function buildAgriculturePrompt({
  message,
  crop,
  language,
  location,
  weather,
}) {
  return `
${SYSTEM_INSTRUCTION}

FARMER CONTEXT:
Crop: ${crop || "Not specified"}
Language: ${language || "English"}
Location: ${location || "Not specified"}
Weather Information: ${weather || "Not provided"}

FARMER QUESTION:
${message}

RESPONSE FORMAT:
- Give a direct answer first.
- Then provide practical steps if applicable.
- Mention important precautions.
- If more information is needed, clearly mention what the farmer should provide.
`;
}

// Basic text validation
function validateMessage(message) {
  if (!message || typeof message !== "string") {
    return "Message is required.";
  }

  const cleanedMessage = message.trim();

  if (!cleanedMessage) {
    return "Message cannot be empty.";
  }

  if (cleanedMessage.length > 2000) {
    return "Message is too long. Please keep it below 2000 characters.";
  }

  return null;
}

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    service: "Farmer Query Support API",
    version: "1.0.0",
    aiModel: GEMINI_MODEL,
    features: [
      "AI Agricultural Chat",
      "Streaming Responses",
      "Multilingual Support",
      "Crop Image Analysis",
    ],
    endpoints: [
      "GET /",
      "POST /api/chat",
      "POST /api/chat/stream",
      "POST /api/recognize",
    ],
  });
});

/* =========================================================
   1. STREAMING CHAT ENDPOINT
========================================================= */

app.post("/api/chat/stream", async (req, res) => {
  const startTime = Date.now();

  const {
    message,
    crop,
    language,
    location,
    weather,
  } = req.body;

  const validationError = validateMessage(message);

  if (validationError) {
    return res.status(400).json({
      error: validationError,
    });
  }

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const model = getGeminiModel();

    const prompt = buildAgriculturePrompt({
      message: message.trim(),
      crop,
      language,
      location,
      weather,
    });

    const streamingResult = await model.generateContentStream(prompt);

    for await (const chunk of streamingResult.stream) {
      const chunkText = chunk.text();

      if (chunkText) {
        res.write(
          `data: ${JSON.stringify({
            text: chunkText,
          })}\n\n`
        );
      }
    }

    const responseTime = Date.now() - startTime;

    res.write(
      `data: ${JSON.stringify({
        done: true,
        responseTime,
      })}\n\n`
    );

    res.write("data: [DONE]\n\n");

    res.end();

    console.log(
      `✅ Streaming response completed in ${responseTime}ms`
    );
  } catch (err) {
    console.error("Gemini SSE Stream Error:", err);

    res.write(
      `data: ${JSON.stringify({
        error:
          "The AI service is temporarily unavailable. Please try again.",
      })}\n\n`
    );

    res.end();
  }
});

/* =========================================================
   2. STANDARD CHAT ENDPOINT
========================================================= */

app.post("/api/chat", async (req, res) => {
  const startTime = Date.now();

  const {
    message,
    crop,
    language,
    location,
    weather,
  } = req.body;

  const validationError = validateMessage(message);

  if (validationError) {
    return res.status(400).json({
      reply: validationError,
    });
  }

  try {
    const model = getGeminiModel();

    const prompt = buildAgriculturePrompt({
      message: message.trim(),
      crop,
      language,
      location,
      weather,
    });

    const result = await model.generateContent(prompt);

    const reply =
      result.response.text() ||
      "Sorry, I could not generate a response.";

    const responseTime = Date.now() - startTime;

    console.log(
      `✅ Chat request completed in ${responseTime}ms`
    );

    res.json({
      success: true,
      reply,
      metadata: {
        responseTime,
        model: GEMINI_MODEL,
        language: language || "English",
        crop: crop || null,
      },
    });
  } catch (err) {
    console.error("Gemini Chat Error:", err);

    res.status(503).json({
      success: false,
      reply:
        "The agricultural AI service is temporarily unavailable. Please try again.",
    });
  }
});

/* =========================================================
   3. CROP IMAGE ANALYSIS
========================================================= */

app.post(
  "/api/recognize",
  upload.single("image"),
  async (req, res) => {
    const startTime = Date.now();

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No crop image uploaded.",
        });
      }

      const {
        crop,
        language,
        location,
      } = req.body;

      const imagePart = {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      };

      const structuredPrompt = `
${SYSTEM_INSTRUCTION}

You are now performing AI-assisted crop image analysis.

FARMER CONTEXT:
Crop: ${crop || "Unknown"}
Language: ${language || "English"}
Location: ${location || "Not specified"}

Analyze the uploaded plant/crop image carefully.

Return the response using exactly these sections:

1. POSSIBLE ISSUE
- Disease, pest, nutrient deficiency, or "No obvious issue"

2. OBSERVED SYMPTOMS
- Mention visible symptoms from the image

3. SEVERITY
- Low / Medium / High

4. RECOMMENDED ACTIONS
- Practical steps the farmer can take

5. PREVENTION
- Steps to reduce future risk

6. IMPORTANT NOTE
- Clearly state that this is an AI-assisted preliminary assessment
  and should be confirmed by a local agricultural expert before
  applying chemical treatment.

Do not claim certainty when the image does not provide enough evidence.
Use simple language.
`;

      const model = getGeminiModel();

      const result = await model.generateContent([
        structuredPrompt,
        imagePart,
      ]);

      const diagnosis =
        result.response.text() ||
        "Unable to analyze the uploaded image.";

      const responseTime = Date.now() - startTime;

      console.log(
        `🌱 Crop image analyzed in ${responseTime}ms`
      );

      res.json({
        success: true,
        filename: req.file.originalname,
        diagnosis,
        metadata: {
          responseTime,
          model: GEMINI_MODEL,
          imageType: req.file.mimetype,
          crop: crop || null,
          language: language || "English",
        },
      });
    } catch (err) {
      console.error(
        "Gemini Multimodal Diagnosis Error:",
        err
      );

      res.status(503).json({
        success: false,
        error:
          "Unable to analyze the crop image at the moment. Please try again.",
      });
    }
  }
);

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "Image size must be less than 5MB.",
      });
    }
  }

  if (err.message?.includes("Invalid image format")) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error.",
  });
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log(
    `🚀 Farmer Query Support Server active on port ${PORT}`
  );

  console.log(`📡 API: http://localhost:${PORT}`);

  console.log(`🤖 Gemini Model: ${GEMINI_MODEL}`);
});