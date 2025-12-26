import { useState, useRef, useEffect, CSSProperties } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
  isError?: boolean;
}

interface STEMChatbotProps {
  language: string;
}

const translations = {
  en: {
    title: "STEM AI Assistant",
    subtitle: "Ask me anything about Science, Math, Engineering & Technology!",
    placeholder: "Type your question here...",
    greeting: "Hi there! 👋 I'm your AI-powered STEM learning buddy! Ask me anything about Science, Technology, Engineering, or Math. I use advanced AI to give you accurate, helpful answers. What would you like to learn today?",
    thinking: "Thinking...",
    error: "Sorry, I encountered an error. Please try again.",
  },
  hi: {
    title: "STEM AI सहायक",
    subtitle: "विज्ञान, गणित, इंजीनियरिंग और प्रौद्योगिकी के बारे में मुझसे कुछ भी पूछें!",
    placeholder: "यहाँ अपना प्रश्न लिखें...",
    greeting: "नमस्ते! 👋 मैं आपका AI-संचालित STEM शिक्षा साथी हूँ! विज्ञान, प्रौद्योगिकी, इंजीनियरिंग या गणित के बारे में मुझसे कुछ भी पूछें। मैं आपको सटीक, उपयोगी उत्तर देने के लिए उन्नत AI का उपयोग करता हूँ। आज आप क्या सीखना चाहेंगे?",
    thinking: "सोच रहा हूँ...",
    error: "क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
  },
};

const quickQuestions = {
  en: [
    "What is photosynthesis?",
    "How does a computer work?",
    "Tell me about gravity",
    "What is AI?",
    "Explain quantum physics",
  ],
  hi: [
    "प्रकाश संश्लेषण क्या है?",
    "कंप्यूटर कैसे काम करता है?",
    "गुरुत्वाकर्षण के बारे में बताएं",
    "एआई क्या है?",
    "क्वांटम भौतिकी समझाएं",
  ],
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are a friendly and knowledgeable STEM (Science, Technology, Engineering, Mathematics) tutor for students. 
Your responses should be:
1. Educational and accurate
2. Easy to understand for students of all ages
3. Engaging and encouraging
4. Concise but comprehensive (aim for 2-4 paragraphs max)
5. Include fun facts or real-world examples when relevant
6. If asked about non-STEM topics, politely redirect to STEM subjects

Always be encouraging and supportive of learning!`;

async function callGeminiAPI(message: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT },
              { text: `Student question: ${message}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
}

async function callGroqAPI(message: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I couldn't generate a response.";
}

async function getAIResponse(message: string): Promise<string> {
  // Try Gemini first
  try {
    return await callGeminiAPI(message);
  } catch (geminiError) {
    console.warn("Gemini API failed, falling back to Groq:", geminiError);

    // Fallback to Groq
    try {
      return await callGroqAPI(message);
    } catch (groqError) {
      console.error("Both APIs failed:", groqError);
      throw new Error("AI services unavailable");
    }
  }
}

export function STEMChatbotSimple({ language }: STEMChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = translations[language as keyof typeof translations] || translations.en;
  const quickQ = quickQuestions[language as keyof typeof quickQuestions] || quickQuestions.en;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          text: t.greeting,
          sender: "bot",
          timestamp: new Date(),
          suggestions: quickQ,
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
        suggestions: quickQ.slice(0, 3),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        text: t.error,
        sender: "bot",
        timestamp: new Date(),
        isError: true,
        suggestions: quickQ.slice(0, 3),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const floatingButtonStyle: CSSProperties = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#a855f7 0%,#ec4899 50%,#f97316 100%)",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    transition: "all 0.3s",
  };

  const chatWindowStyleMobile: CSSProperties = {
    position: "fixed",
    bottom: "0",
    right: "0",
    left: "0",
    top: "0",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    zIndex: 100,
    borderRadius: 0,
    maxWidth: "100vw",
    maxHeight: "100vh"
  };

  const chatWindowStyleDesktop: CSSProperties = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "400px",
    height: "600px",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    zIndex: 100,
    borderRadius: "20px",
    overflow: "hidden",
  };

  const headerStyle: CSSProperties = {
    background: "linear-gradient(90deg,#a855f7 0%,#ec4899 50%,#f97316 100%)",
    color: "#fff",
    padding: "18px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: isMobile ? 0 : "20px",
    borderTopRightRadius: isMobile ? 0 : "20px"
  };

  const messagesContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "18px 16px",
    background: "#f9fafb",
  };

  const inputContainerStyle: CSSProperties = {
    borderTop: "1px solid #e5e7eb",
    padding: "16px",
    background: "#fff",
    display: "flex",
    gap: "8px",
    alignItems: "center"
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    minWidth: 0
  };

  const sendButtonStyle: CSSProperties = {
    padding: "10px 16px",
    background: "linear-gradient(90deg,#a855f7 0%,#ec4899 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "40px"
  };

  const botMessageStyle: CSSProperties = {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    alignItems: "flex-start",
  };

  const userMessageStyle: CSSProperties = {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    justifyContent: "flex-end",
  };

  const botAvatarStyle: CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#a855f7 0%,#ec4899 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const userAvatarStyle: CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#3b82f6 0%,#6366f1 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const messageBubbleBotStyle: CSSProperties = {
    maxWidth: "75%",
    padding: "12px",
    borderRadius: "16px",
    background: "white",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    fontSize: "14px",
    lineHeight: "1.6",
    whiteSpace: "pre-line",
  };

  const messageBubbleUserStyle: CSSProperties = {
    maxWidth: "75%",
    padding: "12px",
    borderRadius: "16px",
    background: "linear-gradient(90deg,#3b82f6 0%,#a855f7 100%)",
    color: "white",
    fontSize: "14px",
    lineHeight: "1.5",
  };

  const suggestionButtonStyle: CSSProperties = {
    padding: "6px 12px",
    margin: "4px",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    background: "white",
    cursor: "pointer",
    fontSize: "12px",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s",
  };

  const closeButtonStyle: CSSProperties = {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: "4px",
    padding: "8px",
    cursor: "pointer",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={floatingButtonStyle}
        onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Bot size={32} color="white" />
        <span style={{ position: "absolute", top: "4px", right: "4px" }}>
          <Sparkles size={16} color="#fbbf24" />
        </span>
      </button>
    );
  }

  return (
    <div style={isMobile ? chatWindowStyleMobile : chatWindowStyleDesktop}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={24} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "16px" }}>{t.title}</div>
            {!isMobile && <div style={{ fontSize: "12px", opacity: 0.9 }}>{t.subtitle}</div>}
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={closeButtonStyle}
          onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
          onMouseOut={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
        >
          <X size={20} />
        </button>
      </div>
      <div style={messagesContainerStyle}>
        {messages.map((message) => (
          <div key={message.id}>
            {message.sender === "bot" ? (
              <div style={botMessageStyle}>
                <div style={botAvatarStyle}>
                  {message.isError ? (
                    <AlertCircle size={18} color="white" />
                  ) : (
                    <Bot size={18} color="white" />
                  )}
                </div>
                <div>
                  <div style={{
                    ...messageBubbleBotStyle,
                    ...(message.isError ? { background: "#fef2f2", border: "1px solid #fecaca" } : {})
                  }}>{message.text}</div>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div style={{ marginTop: "8px", marginLeft: "8px" }}>
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          style={suggestionButtonStyle}
                          disabled={isTyping}
                          onMouseOver={e => {
                            if (!isTyping) {
                              e.currentTarget.style.background = "#f3e8ff";
                              e.currentTarget.style.borderColor = "#a855f7";
                            }
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = "white";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                          }}
                        >
                          <Lightbulb size={12} color="#f59e0b" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={userMessageStyle}>
                <div style={messageBubbleUserStyle}>{message.text}</div>
                <div style={userAvatarStyle}>
                  <User size={18} color="white" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={botMessageStyle}>
            <div style={botAvatarStyle}>
              <Bot size={18} color="white" />
            </div>
            <div style={messageBubbleBotStyle}>
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9ca3af", animation: "bounce 0.6s infinite" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9ca3af", animation: "bounce 0.6s infinite 0.2s" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9ca3af", animation: "bounce 0.6s infinite 0.4s" }} />
                <span style={{ marginLeft: "8px", fontSize: "12px", color: "#6b7280" }}>{t.thinking}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={inputContainerStyle}>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{ display: "flex", gap: "8px", width: "100%" }}
        >
          <input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={t.placeholder}
            style={inputStyle}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            style={{
              ...sendButtonStyle,
              opacity: inputValue.trim() && !isTyping ? 1 : 0.5,
              cursor: inputValue.trim() && !isTyping ? "pointer" : "not-allowed",
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
