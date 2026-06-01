
import { useState, useEffect, useRef } from "react";
import { FaCamera, FaPaperPlane } from "react-icons/fa";
// Chatbot Component
export function Chatbot({ messages, setMessages }) {
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);
  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognitionRef.current = recognition;
  }, []);
  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  // Handle image upload: only set preview, do NOT send message yet
  const handleImageUpload = (file) => {
    if (!file) return;
    setSelectedImage(file);
  };
  // Send message with optional image
  const handleSend = async () => {
    if (!inputMessage.trim() && !selectedImage) return;
    // Remove any preview messages if you had any (not needed now)
    setMessages((prev) => prev.filter((msg) => !msg.isPreview));
    const userMessage = {
      id: Date.now(),
      text: inputMessage || "[Image]",
      sender: "user",
      timestamp: new Date(),
      image: selectedImage ? URL.createObjectURL(selectedImage) : null,
    };
    setMessages((prev) => [...prev, userMessage]);
    // Clear input and preview image after sending
    setInputMessage("");
    setSelectedImage(null);
    const typingMessage = {
      id: Date.now() + 1,
      text: "AI is thinking...",
      sender: "bot",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);
    try {
      let botReply = "";
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const res = await fetch("http://52.23.121.202:5000/api/recognize", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        botReply = data.result;
      } else {
        const res = await fetch("http://52.23.121.202:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: inputMessage }),
        });
        const data = await res.json();
        botReply = data.reply;
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isTyping ? { ...msg, text: botReply, isTyping: false } : msg
        )
      );
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isTyping
            ? {
                ...msg,
                text: "⚠️ Could not connect to AI service.",
                isTyping: false,
              }
            : msg
        )
      );
    }
  };
  return (
    <div className="bg-green-900/50 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-green-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">AI</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Farm Assistant</h2>
          <p className="text-white/70 text-sm">Helping you grow smarter</p>
        </div>
        <div className="ml-auto">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto mb-4 space-y-4 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <span className="text-white text-2xl">🌾</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Start a conversation</h3>
            <p className="text-white/70 text-sm">Ask me anything about your crops, soil, or weather!</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-yellow-400 to-green-500 text-white rounded-br-md"
                    : "bg-green-800/70 text-white rounded-bl-md backdrop-blur-sm border border-white/10"
                } shadow-lg`}>
                  <p className="text-sm">{msg.text}</p>
                  {msg.image && (
                    <img src={msg.image} alt="uploaded" className="mt-2 rounded-md max-h-60 object-contain" />
                  )}
                  {msg.timestamp && (
                    <p className="text-xs opacity-70 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                  )}
                </div>
              </div>
            ))}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {selectedImage && (
        <div className="flex items-center gap-3 bg-green-800/50 rounded-xl p-2 mb-2">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="preview"
            className="h-16 rounded-md object-contain"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="text-yellow-400 hover:text-yellow-500 font-bold"
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
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 bg-green-800/50 border border-white/20 rounded-full px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        />

        <button
    onClick={toggleListening}
    className={`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
      isListening
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-yellow-400 hover:bg-yellow-500 text-white"
    }`}
    title={isListening ? "Stop Listening" : "Start Listening"}
  >
    🎤
  
  </button>

        <label className="bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full cursor-pointer transition-all duration-300">
          <FaCamera />
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} className="hidden" />
        </label>
        <button
          onClick={handleSend}
          className="bg-gradient-to-br from-yellow-400 to-green-500 hover:from-yellow-500 hover:to-green-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ messages }) {
  const stats = {
    totalMessages: messages.length,
    userMessages: messages.filter((m) => m.sender === "user").length,
    botResponses: messages.filter((m) => m.sender === "bot").length,
    avgResponseTime: "1.2s",
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
              <p className="text-white/70 text-xs">Messages</p>
            </div>
          </div>
        </div>

        <div className="bg-green-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-green-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <svg
                className="w-5 h-5 text-white"
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
              <p className="text-2xl font-bold text-white">{stats.avgResponseTime}</p>
              <p className="text-white/70 text-xs">Avg Response</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-green-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          Live Activity
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
          {messages.slice(-5).map((message) => (
            <div
              key={message.id}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  message.sender === "user"
                    ? "bg-yellow-400 text-green-900"
                    : "bg-green-500 text-white"
                }`}
              >
                {message.sender === "user" ? "U" : "AI"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-sm truncate">{message.text}</p>
                <p className="text-white/50 text-xs">
                  {message.timestamp?.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-3 opacity-50">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-white/50 text-sm">No activity yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-green-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full bg-gradient-to-r from-yellow-400/20 to-green-500/20 hover:from-yellow-400/30 hover:to-green-500/30 border border-white/20 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Clear Chat History
          </button>
          <button className="w-full bg-gradient-to-r from-yellow-500/20 to-green-600/20 hover:from-yellow-500/30 hover:to-green-600/30 border border-white/20 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Export Conversation
          </button>
          <button className="w-full bg-gradient-to-r from-green-400/20 to-yellow-500/20 hover:from-green-400/30 hover:to-yellow-500/30 border border-white/20 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Page
export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-yellow-600 to-orange-400 relative overflow-hidden text-white">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-400/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-32 bg-white/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-40 bg-white/10 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-green-900/40 blur-xl animate-pulse"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-white/10"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-green-200 to-white bg-clip-text text-transparent mb-4 animate-fade-in">
            Farm AI Chat
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in animation-delay-500">
            Ask questions about crops, weather, and farming techniques
          </p>
        </div>

        <div className="md:flex md:gap-8 max-w-7xl mx-auto">
          <div className="md:w-2/3 animate-slide-in-left">
            <Chatbot messages={messages} setMessages={setMessages} />
          </div>
          <div className="md:w-1/3 mt-8 md:mt-0 animate-slide-in-right animation-delay-300">
            <Dashboard messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
}
