import { useState, useEffect, useRef } from "react";
import { FaCamera, FaPaperPlane } from "react-icons/fa";

// ======================================================
// Chatbot Component
// ======================================================

export function Chatbot({ messages, setMessages }) {
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Farmer context
  const [crop, setCrop] = useState("Wheat");
  const [language, setLanguage] = useState("English");
  const [location, setLocation] = useState("India");

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // ======================================================
  // Auto scroll
  // ======================================================

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  // ======================================================
  // Speech Recognition
  // ======================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      null;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.lang =
      language === "Hindi" ? "hi-IN" : "en-US";

    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setInputMessage((prev) =>
        prev
          ? prev + " " + transcript
          : transcript
      );
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [language]);

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      null;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // ======================================================
  // Image Upload
  // ======================================================

  const handleImageUpload = (file) => {
    if (!file) return;

    // Basic frontend validation
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image smaller than 5MB.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG or WEBP image.");
      return;
    }

    setSelectedImage(file);
  };

  // ======================================================
  // Send Message
  // ======================================================

  const handleSend = async () => {
    if (
      (!inputMessage.trim() && !selectedImage) ||
      isSending
    ) {
      return;
    }

    const currentMessage = inputMessage.trim();
    const currentImage = selectedImage;

    // ----------------------------------------------------
    // User message
    // ----------------------------------------------------

    const userMessage = {
      id: Date.now(),
      text: currentMessage || "Crop image uploaded",
      sender: "user",
      timestamp: new Date(),
      image: currentImage
        ? URL.createObjectURL(currentImage)
        : null,
    };

    setMessages((prev) => [
      ...prev.filter((msg) => !msg.isPreview),
      userMessage,
    ]);

    // Clear input immediately
    setInputMessage("");
    setSelectedImage(null);

    // ----------------------------------------------------
    // AI typing message
    // ----------------------------------------------------

    const typingMessage = {
      id: Date.now() + 1,
      text: currentImage
        ? "🌱 Analyzing your crop image..."
        : "🤖 AI is thinking...",
      sender: "bot",
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages((prev) => [
      ...prev,
      typingMessage,
    ]);

    setIsSending(true);

    try {
      let botReply = "";

      // ==================================================
      // CASE 1: CROP IMAGE ANALYSIS
      // ==================================================

      if (currentImage) {
        const formData = new FormData();

        formData.append(
          "image",
          currentImage
        );

        // Send farmer context
        formData.append("crop", crop);
        formData.append("language", language);
        formData.append("location", location);

        const res = await fetch(
          "${API_URL}/api/recognize",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.error ||
              "Crop image analysis failed."
          );
        }

        // IMPORTANT:
        // Backend returns `diagnosis`, NOT `result`
        botReply =
          data.diagnosis ||
          "Unable to analyze the crop image.";
      }

      // ==================================================
      // CASE 2: NORMAL AGRICULTURAL CHAT
      // ==================================================

      else {
        const res = await fetch(
          "${API_URL}/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message: currentMessage,
              crop: crop,
              language: language,
              location: location,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.reply ||
              "Unable to get AI response."
          );
        }

        botReply =
          data.reply ||
          "Sorry, I could not generate a response.";
      }

      // ==================================================
      // Update AI Message
      // ==================================================

      setMessages((prev) =>
        prev.map((msg) =>
          msg.isTyping
            ? {
                ...msg,
                text: botReply,
                isTyping: false,
              }
            : msg
        )
      );
    } catch (err) {
      console.error(
        "Farmer AI Chat Error:",
        err
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.isTyping
            ? {
                ...msg,

                text:
                  "⚠️ Unable to connect to the agricultural AI service. Please try again.",

                isTyping: false,
              }
            : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="bg-[#2D4316]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

      {/* Header */}

      <div className="flex items-center gap-4 mb-6">

        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-amber-500 to-lime-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl">
            🌾
          </span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            AI Farm Assistant
          </h2>

          <p className="text-white/70 text-sm">
            AI-powered agricultural support
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />

          <span className="text-lime-300 text-xs">
            Online
          </span>
        </div>

      </div>

      {/* Farmer Context */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">

        {/* Crop */}

        <div>
          <label className="block text-white/70 text-xs mb-1">
            Crop
          </label>

          <select
            value={crop}
            onChange={(e) =>
              setCrop(e.target.value)
            }
            className="w-full bg-[#1F310C]/80 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          >
            <option value="Wheat">
              Wheat
            </option>

            <option value="Rice">
              Rice
            </option>

            <option value="Maize">
              Maize
            </option>

            <option value="Cotton">
              Cotton
            </option>

            <option value="Tomato">
              Tomato
            </option>

            <option value="Potato">
              Potato
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        {/* Language */}

        <div>
          <label className="block text-white/70 text-xs mb-1">
            Language
          </label>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
            className="w-full bg-[#1F310C]/80 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          >
            <option value="English">
              English
            </option>

            <option value="Hindi">
              Hindi
            </option>
          </select>
        </div>

        {/* Location */}

        <div>
          <label className="block text-white/70 text-xs mb-1">
            Location
          </label>

          <input
            type="text"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            placeholder="e.g. Haryana"
            className="w-full bg-[#1F310C]/80 border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

      </div>

      {/* Context indicator */}

      <div className="bg-amber-500/15 border border-amber-400/30 rounded-xl px-3 py-2 mb-4">
        <p className="text-amber-200 text-xs">
          🌱 AI will consider your{" "}
          <strong>{crop}</strong> crop,
          location{" "}
          <strong>{location}</strong>, and
          respond in{" "}
          <strong>{language}</strong>.
        </p>
      </div>

      {/* Messages */}

      <div className="h-96 overflow-y-auto mb-4 space-y-4 scrollbar-hide">

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">

            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-amber-500 to-lime-600 rounded-full flex items-center justify-center mb-4 animate-bounce shadow-lg">
              <span className="text-white text-2xl">
                🌾
              </span>
            </div>

            <h3 className="text-white font-semibold mb-2">
              Start a conversation
            </h3>

            <p className="text-white/70 text-sm max-w-sm">
              Ask about crop diseases,
              fertilizers, soil, irrigation,
              pests, or weather precautions.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4">

              <button
                onClick={() =>
                  setInputMessage(
                    "My wheat leaves are turning yellow. What should I do?"
                  )
                }
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full border border-white/15 transition-all"
              >
                🌾 Yellow wheat leaves
              </button>

              <button
                onClick={() =>
                  setInputMessage(
                    "How often should I irrigate my crop?"
                  )
                }
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full border border-white/15 transition-all"
              >
                💧 Irrigation advice
              </button>

            </div>

          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-lime-500 text-slate-950 font-medium rounded-br-md"
                      : "bg-[#1F310C]/80 text-white rounded-bl-md backdrop-blur-sm border border-white/10"
                  } shadow-lg`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Uploaded crop"
                      className="mt-2 rounded-md max-h-60 object-contain"
                    />
                  )}

                  {msg.timestamp && (
                    <p className={`text-xs mt-1 ${msg.sender === "user" ? "opacity-80 text-slate-900" : "opacity-60 text-white"}`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Image Preview */}

      {selectedImage && (
        <div className="flex items-center gap-3 bg-[#1F310C]/70 rounded-xl p-2 mb-2 border border-white/10">

          <img
            src={URL.createObjectURL(
              selectedImage
            )}
            alt="Crop preview"
            className="h-16 rounded-md object-contain"
          />

          <div className="flex-1">
            <p className="text-white text-xs">
              Crop image ready for AI analysis
            </p>

            <p className="text-white/50 text-xs">
              {selectedImage.name}
            </p>
          </div>

          <button
            onClick={() =>
              setSelectedImage(null)
            }
            className="text-amber-400 hover:text-amber-300 font-bold"
            title="Remove image"
            type="button"
          >
            ✕
          </button>

        </div>
      )}

      {/* Input */}

      <div className="flex gap-3 items-center">

        <input
          type="text"
          value={inputMessage}
          disabled={isSending}
          onChange={(e) =>
            setInputMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !isSending
            ) {
              handleSend();
            }
          }}
          placeholder={
            isSending
              ? "AI is processing..."
              : "Ask about your crop..."
          }
          className="flex-1 bg-[#1F310C]/70 border border-white/20 rounded-full px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:opacity-50"
        />

        {/* Voice */}

        <button
          onClick={toggleListening}
          disabled={isSending}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold"
          } disabled:opacity-50`}
          title={
            isListening
              ? "Stop Listening"
              : "Start Listening"
          }
          type="button"
        >
          🎤
        </button>

        {/* Camera */}

        <label
          className={`bg-amber-400 hover:bg-amber-500 text-slate-950 p-3 rounded-full cursor-pointer transition-all duration-300 ${
            isSending
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
          title="Upload crop image"
        >
          <FaCamera />

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) =>
              handleImageUpload(
                e.target.files?.[0]
              )
            }
            className="hidden"
          />
        </label>

        {/* Send */}

        <button
          onClick={handleSend}
          disabled={
            isSending ||
            (!inputMessage.trim() &&
              !selectedImage)
          }
          className="bg-gradient-to-r from-yellow-400 via-amber-500 to-lime-500 hover:opacity-95 text-slate-950 p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          title="Send"
        >
          <FaPaperPlane />
        </button>

      </div>

    </div>
  );
}


// ======================================================
// Dashboard Component
// ======================================================

function Dashboard({ messages }) {
  const stats = {
    totalMessages: messages.length,

    userMessages: messages.filter(
      (m) => m.sender === "user"
    ).length,

    botResponses: messages.filter(
      (m) => m.sender === "bot"
    ).length,

    avgResponseTime: "AI powered",
  };

  return (
    <div className="space-y-4">

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-[#2D4316]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">

          <p className="text-2xl font-bold text-amber-300">
            {stats.totalMessages}
          </p>

          <p className="text-white/70 text-xs">
            Messages
          </p>

        </div>

        <div className="bg-[#2D4316]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">

          <p className="text-2xl font-bold text-amber-300">
            {stats.botResponses}
          </p>

          <p className="text-white/70 text-xs">
            AI Responses
          </p>

        </div>

      </div>

      {/* Response */}

      <div className="bg-[#2D4316]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-amber-500 to-lime-600 rounded-full flex items-center justify-center">

            <svg
              className="w-5 h-5 text-slate-950"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>

          </div>

          <div>

            <p className="text-lg font-bold text-white">
              {stats.avgResponseTime}
            </p>

            <p className="text-white/70 text-xs">
              Assistant
            </p>

          </div>

        </div>

      </div>

      {/* Activity Feed */}

      <div className="bg-[#2D4316]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">

          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />

          Live Activity

        </h3>

        <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">

          {messages.slice(-5).map(
            (message) => (
              <div
                key={message.id}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200 border border-white/5"
              >

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    message.sender === "user"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-lime-600 text-white"
                  }`}
                >
                  {message.sender ===
                  "user"
                    ? "U"
                    : "AI"}
                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-white/90 text-sm truncate">
                    {message.text}
                  </p>

                  <p className="text-white/50 text-xs">
                    {message.timestamp?.toLocaleTimeString()}
                  </p>

                </div>

              </div>
            )
          )}

          {messages.length === 0 && (
            <div className="text-center py-8">

              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 opacity-50">

                <span className="text-xl">
                  🌱
                </span>

              </div>

              <p className="text-white/50 text-sm">
                No activity yet
              </p>

            </div>
          )}

        </div>

      </div>

      {/* Quick Actions */}

      <div className="bg-[#2D4316]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

        <h3 className="text-lg font-bold text-white mb-4">
          Quick Actions
        </h3>

        <div className="space-y-2">

          <button
            onClick={() =>
              window.location.reload()
            }
            className="w-full bg-[#1F310C]/80 hover:bg-amber-500/20 border border-white/15 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            Clear Chat History
          </button>

          <button
            onClick={() => {
              const conversation =
                messages
                  .map(
                    (m) =>
                      `${m.sender.toUpperCase()}: ${m.text}`
                  )
                  .join("\n\n");

              const blob = new Blob(
                [conversation],
                {
                  type: "text/plain",
                }
              );

              const url =
                URL.createObjectURL(blob);

              const a =
                document.createElement("a");

              a.href = url;
              a.download =
                "farmer-ai-conversation.txt";

              a.click();

              URL.revokeObjectURL(url);
            }}
            className="w-full bg-[#1F310C]/80 hover:bg-amber-500/20 border border-white/15 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            Export Conversation
          </button>

        </div>

      </div>

    </div>
  );
}


// ======================================================
// Main Page
// ======================================================

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1C2C0B] via-[#48530C] to-[#C97B00]">

      {/* Background Grid Accent */}

      <div className="absolute inset-0 bg-grid-white/5" />

      {/* Content */}

      <div className="relative z-10 container mx-auto px-4 py-8">

        <div className="mb-8 text-center">

          {/* AI Tag Line Pill from Hero Header */}
          <div className="inline-flex items-center gap-2 bg-[#2D4316]/80 border border-amber-400/30 px-4 py-1.5 rounded-full mb-4 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-amber-200 text-xs font-medium">AI-Powered Agricultural Assistant</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in tracking-tight">
            Helping Farmers with <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-lime-400 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Ask questions, get crop advice, weather updates, and agricultural support instantly.
          </p>

        </div>

        <div className="md:flex md:gap-8 max-w-7xl mx-auto">

          <div className="md:w-2/3 animate-slide-in-left">
            <Chatbot
              messages={messages}
              setMessages={setMessages}
            />
          </div>

          <div className="md:w-1/3 mt-8 md:mt-0 animate-slide-in-right">
            <Dashboard
              messages={messages}
            />
          </div>

        </div>

      </div>

    </div>
  );
}