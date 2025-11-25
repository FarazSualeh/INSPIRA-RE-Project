import { useState, useRef, useEffect, CSSProperties } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Lightbulb,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
}

interface STEMChatbotProps {
  language: string;
}

const translations = {
  en: {
    title: "STEM AI Assistant",
    subtitle: "Ask me anything about Science, Math, Engineering & Technology!",
    placeholder: "Type your question here...",
    greeting: "Hi there! 👋 I'm your STEM learning buddy! Ask me anything about Science, Technology, Engineering, or Math. What would you like to learn today?",
  },
  hi: {
    title: "STEM AI सहायक",
    subtitle: "विज्ञान, गणित, इंजीनियरिंग और प्रौद्योगिकी के बारे में मुझसे कुछ भी पूछें!",
    placeholder: "यहाँ अपना प्रश्न लिखें...",
    greeting: "नमस्ते! 👋 मैं आपका STEM शिक्षा साथी हूँ! विज्ञान, प्रौद्योगिकी, इंजीनियरिंग या गणित के बारे में मुझसे कुछ भी पूछें। आज आप क्या सीखना चाहेंगे?",
  },
};

const quickQuestions = {
  en: [
    "What is photosynthesis?",
    "How does a computer work?",
    "Tell me about gravity",
    "Who is Newton?",
    "What is AI?",
    "Tell me a fun fact",
    "What is a robot?",
    "What is Python?",
    "What is a black hole?",
    "What is mass?",
    "What is electricity?",
    "What is the speed of light?",
    "Explain E = mc^2",
    "Why is the sky blue?",
    "Who invented zero?",
    "What is chlorophyll?",
    "How does the internet work?",
  ],
  hi: [
    "प्रकाश संश्लेषण क्या है?",
    "कंप्यूटर कैसे काम करता है?",
    "गुरुत्वाकर्षण के बारे में बताएं",
    "न्यूटन कौन थे?",
    "एआई क्या है?",
    "कोई मज़ेदार तथ्य बताएं",
    "रोबोट क्या है?",
    "पाइथन क्या है?",
    "ब्लैक होल क्या है?",
    "द्रव्यमान क्या है?",
    "बिजली क्या है?",
    "प्रकाश की गति क्या है?",
    "E = mc^2 समझाएं",
    "आसमान नीला क्यों है?",
    "शून्य किसने खोजा?",
    "क्लोरोफिल क्या है?",
    "इंटरनेट कैसे काम करता है?",
  ],
};

const maxSuggestions = 5;

const getResponse = (message: string): { text: string; suggestions?: string[] } => {
  const lower = message.toLowerCase();

  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey") ||
    lower.includes("namaste") ||
    lower.includes("assalamualaikum") ||
    lower.includes("kaise ho")
  ) {
    if (lower.includes("namaste")) {
      return {
        text: "नमस्ते! 😊 STEM सीखने के लिए मुझसे कुछ भी पूछें।",
        suggestions: quickQuestions.hi.slice(0, maxSuggestions),
      };
    }
    if (lower.includes("assalamualaikum")) {
      return {
        text: "Assalamualaikum! 🌟 How can I help with science, technology, engineering, or math?",
        suggestions: quickQuestions.en.slice(0, maxSuggestions),
      };
    }
    if (lower.includes("kaise ho")) {
      return {
        text: "मैं अच्छा हूँ, धन्यवाद! आप कैसे हैं? STEM से संबंधित कोई सवाल पूछना चाहेंगे?",
        suggestions: quickQuestions.hi.slice(0, maxSuggestions),
      };
    }
    return {
      text: "Hello! 👋 I'm excited to help you learn! What STEM topic interests you today?",
      suggestions: quickQuestions.en.slice(0, maxSuggestions),
    };
  }

  if (lower.includes("bye") || lower.includes("goodbye")) {
    return {
      text: "Goodbye! 👋 Keep learning and exploring STEM topics!",
      suggestions: ["Tell me a fun fact", "What is photosynthesis?", "What is a robot?"].slice(0, maxSuggestions),
    };
  }

  if (lower.includes("fun fact")) {
    return {
      text: "Did you know? Honey never spoils! Archaeologists have found edible honey in ancient Egyptian tombs. 🍯",
      suggestions: ["Why is honey special?", "What is a black hole?", "Who invented zero?"].slice(0, maxSuggestions),
    };
  }

  if (lower.includes("photosynthesis")) {
    return {
      text: "Photosynthesis is the process by which plants use sunlight to turn carbon dioxide and water into food (glucose) and oxygen! 🌱☀️",
      suggestions: ["What is chlorophyll?", "Why are plants green?", "Why do leaves fall?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("chlorophyll")) {
    return {
      text: "Chlorophyll is a green pigment in plants that helps them absorb sunlight for photosynthesis.",
      suggestions: ["Why are plants green?", "What is photosynthesis?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("computer")) {
    return {
      text: "A computer is an electronic device that processes information using hardware (like CPU, memory) and software (programs). 💻",
      suggestions: ["What is a CPU?", "What is coding?", "How does the internet work?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("cpu")) {
    return {
      text: "CPU stands for Central Processing Unit. It's the brain of the computer that performs calculations and runs programs.",
      suggestions: ["What is RAM?", "What is coding?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("ram")) {
    return {
      text: "RAM (Random Access Memory) is temporary memory where data is stored for quick access by the CPU while a computer is running.",
      suggestions: ["What is CPU?", "What is memory?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("internet")) {
    return {
      text: "The internet is a global network of computers that communicate to share information, websites, and services.",
      suggestions: ["What is a computer?", "What is coding?", "How does WiFi work?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("gravity")) {
    return {
      text: "Gravity is a force that pulls objects towards each other. It keeps planets, stars, and galaxies together and makes objects fall on Earth. 🌍",
      suggestions: ["Who discovered gravity?", "What is mass?", "Explain E = mc^2"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("newton")) {
    return {
      text: "Sir Isaac Newton was a famous physicist and mathematician who discovered the laws of motion and universal gravitation.",
      suggestions: ["What are Newton's Laws?", "What is gravity?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("black hole")) {
    return {
      text: "A black hole is an area in space where gravity is so strong that not even light can escape. It forms when massive stars collapse.",
      suggestions: ["What is gravity?", "What is a star?", "Tell me a fun fact"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("ai") || lower.includes("artificial intelligence")) {
    return {
      text: "Artificial Intelligence (AI) means computers and machines that can do tasks normally requiring human intelligence, like learning or recognizing images.",
      suggestions: ["What is Machine Learning?", "What is coding?", "Tell me a fun fact"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("robot")) {
    return {
      text: "A robot is a machine that can perform tasks automatically, often guided by computer programs or sensors. 🤖",
      suggestions: ["How to build a robot?", "What are sensors?", "What is AI?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("sensors")) {
    return {
      text: "Sensors are devices that detect changes in the environment, like light, heat, or motion, and help robots or machines respond.",
      suggestions: ["How to build a robot?", "What is AI?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("python")) {
    return {
      text: "Python is a popular programming language used for web development, data science, automation, and more. It's known for its simplicity.",
      suggestions: ["How to start coding?", "What is coding?", "What is JavaScript?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("java") || lower.includes("javascript")) {
    return {
      text: "JavaScript is a programming language mainly used to make websites interactive. Java is commonly used for building apps and enterprise software.",
      suggestions: ["What is coding?", "What is Python?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("coding") || lower.includes("programming")) {
    return {
      text: "Coding means writing instructions (code) for computers to understand and execute, using languages like Python or JavaScript.",
      suggestions: ["What is Python?", "How to start coding?", "What is JavaScript?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("math") || lower.includes("mathematics")) {
    return {
      text: "Mathematics is the study of numbers, shapes, and patterns. It helps us understand the world and solve problems.",
      suggestions: ["Who invented zero?", "Explain E = mc^2", "What is mass?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("mass")) {
    return {
      text: "Mass means how much matter is in an object. It doesn't change, even if the object moves or is affected by gravity.",
      suggestions: ["What is gravity?", "What is weight?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("weight")) {
    return {
      text: "Weight is the force gravity exerts on an object. It's different from mass, which is the amount of matter in an object.",
      suggestions: ["What is mass?", "What is gravity?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("electricity")) {
    return {
      text: "Electricity is the flow of electrons (tiny charged particles) through wires or materials. It's used to power devices and lights.",
      suggestions: ["How does a battery work?", "What is energy?", "What is current?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("battery")) {
    return {
      text: "A battery stores chemical energy and converts it into electrical energy to power devices.",
      suggestions: ["What is energy?", "What is electricity?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("speed of light")) {
    return {
      text: "The speed of light in a vacuum is about 299,792 kilometers per second! Nothing can travel faster than light.",
      suggestions: ["Why is the sky blue?", "What is a black hole?", "Explain E = mc^2"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("e = mc^2")) {
    return {
      text: "Einstein's equation E=mc² shows that mass can be converted to energy. 'E' is energy, 'm' is mass, and 'c' is the speed of light.",
      suggestions: ["What is mass?", "Who was Einstein?", "Tell me a fun fact"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("einstein")) {
    return {
      text: "Albert Einstein was a brilliant scientist known for his theory of relativity and the famous equation E=mc².",
      suggestions: ["Explain E = mc^2", "What is physics?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("why is the sky blue")) {
    return {
      text: "The sky appears blue because blue light from the sun is scattered in all directions by gases in the Earth's atmosphere.",
      suggestions: ["What is light?", "What is the atmosphere?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("atmosphere")) {
    return {
      text: "The atmosphere is the layer of gases surrounding Earth or another planet. It protects us and allows us to breathe.",
      suggestions: ["Why is the sky blue?", "What is oxygen?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("who invented zero")) {
    return {
      text: "Zero was invented by ancient Indian mathematicians. Brahmagupta was the first to use zero as a number and write rules for its use.",
      suggestions: ["Who was Brahmagupta?", "What is mathematics?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("brahmagupta")) {
    return {
      text: "Brahmagupta was a famous Indian mathematician and astronomer known for introducing the concept of zero.",
      suggestions: ["Who invented zero?", "What is mathematics?"].slice(0, maxSuggestions),
    };
  }
  if (lower.includes("why is honey special")) {
    return {
      text: "Honey is special because it doesn't spoil. Its low moisture and acidic nature prevent bacteria and fungi from growing.",
      suggestions: ["Tell me a fun fact", "What is chemistry?"].slice(0, maxSuggestions),
    };
  }

  return {
    text: "That's an interesting question! 🤔 I'm still learning about that topic. Can you ask me about science, math, technology, or engineering?",
    suggestions: quickQuestions.en.slice(0, maxSuggestions),
  };
};

export function STEMChatbotSimple({ language }: STEMChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = translations[language as keyof typeof translations] || translations.en;
  const quickQ = quickQuestions[language as keyof typeof quickQuestions] || quickQuestions.en.slice(0, maxSuggestions);

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

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = getResponse(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse.text,
        sender: "bot",
        timestamp: new Date(),
        suggestions: botResponse.suggestions,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
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
    lineHeight: "1.5",
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
                  <Bot size={18} color="white" />
                </div>
                <div>
                  <div style={messageBubbleBotStyle}>{message.text}</div>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div style={{ marginTop: "8px", marginLeft: "8px" }}>
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          style={suggestionButtonStyle}
                          onMouseOver={e => {
                            e.currentTarget.style.background = "#f3e8ff";
                            e.currentTarget.style.borderColor = "#a855f7";
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
              <div style={{ display: "flex", gap: "4px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9ca3af", animation: "bounce 0.6s infinite" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9ca3af", animation: "bounce 0.6s infinite 0.2s" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9ca3af", animation: "bounce 0.6s infinite 0.4s" }} />
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
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            style={{
              ...sendButtonStyle,
              opacity: inputValue.trim() ? 1 : 0.5,
              cursor: inputValue.trim() ? "pointer" : "not-allowed",
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
