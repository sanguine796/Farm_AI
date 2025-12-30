import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import { useLanguage } from "../LanguageContext";
import { getTranslation } from "../i18n";

const ChatNew = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Language codes for Web Speech API
  const languageMap = {
    en: "en-IN",
    ml: "ml-IN",
    hi: "hi-IN",
    te: "te-IN",
  };

  const quickQuestions = {
    en: [
      "What crops grow best in my region?",
      "How do I treat leaf spots?",
      "When should I water?",
    ],
    ml: [
      "എന്റെ പ്രദേശത്ത് ഏത് വിളകൾ നന്നായി വളരുന്നു?",
      "ഞാൻ ലീഫ് സ്പോട്ടുകൾ എങ്ങനെ ചികിത്സിക്കണം?",
      "ഞാൻ എപ്പോൾ ജലസേചനം ചെയ്യണം?",
    ],
    hi: [
      "मेरे क्षेत्र में कौन सी फसलें सबसे अच्छी बढ़ती हैं?",
      "मैं पत्ती के धब्बे का इलाज कैसे करूँ?",
      "मुझे कब पानी देना चाहिए?",
    ],
    te: [
      "నా ప్రాంతంలో ఏ పంటలు ఉత్తమంగా పెరుగుతాయి?",
      "నేను ఎండ్ బాగ్ చికిత్స చేయాలి?",
      "నేను ఎప్పుడు నీటిని పోయాలి?",
    ],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      return;
    }

    const userMessageText = inputText.trim();
    
    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
      language: language,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    console.log("[CHAT-API] Sending message:", userMessageText);
    console.log("[CHAT-API] Language:", language);

    // Add a loading indicator message
    const loadingMessage = {
      id: messages.length + 2,
      text: "⏳ Processing your question...",
      sender: "bot",
      timestamp: new Date(),
      language: language,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Send message to backend API with language parameter
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessageText,
          question: userMessageText, // Support both field names
          language: language,
        }),
      });

      if (!response.ok) {
        console.error("[CHAT-API] Server error status:", response.status);
        throw new Error(`HTTP ${response.status}: Backend request failed`);
      }

      const data = await response.json();
      
      // Extract response from various possible field names
      let responseText = data.answer || data.reply || data.response || data.text;
      
      if (!responseText) {
        console.error("[CHAT-API] No response field found in backend response:", data);
        throw new Error("Backend returned empty response");
      }

      console.log("[CHAT-API] Backend response received:", responseText);

      // Remove loading message and add actual response
      setMessages((prev) => {
        // Filter out the loading message
        const withoutLoading = prev.filter((msg) => msg.id !== loadingMessage.id);
        
        // Add real response
        const botMessage = {
          id: prev.length,
          text: responseText,
          sender: "bot",
          timestamp: new Date(),
          language: language,
        };
        
        return [...withoutLoading, botMessage];
      });

      // Auto-speak bot response
      speakText(responseText);

    } catch (error) {
      console.error("[CHAT-API] Error:", error.message);

      // Provide clear error message
      let errorMessage = "Unable to get response from server. Please try again.";
      
      if (error.message.includes("HTTP")) {
        errorMessage = "Server error. Please ensure the backend is running.";
      } else if (error.message.includes("fetch")) {
        errorMessage = "Network error. Check your internet connection.";
      }

      // Remove loading message and add error response
      setMessages((prev) => {
        const withoutLoading = prev.filter((msg) => msg.id !== loadingMessage.id);
        
        const errorBotMessage = {
          id: prev.length,
          text: errorMessage,
          sender: "bot",
          timestamp: new Date(),
          language: language,
        };
        
        return [...withoutLoading, errorBotMessage];
      });
    }
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      // Cancel previous speech if any
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on selected language
      const langMap = {
        en: "en-IN",
        ml: "ml-IN",
        hi: "hi-IN",
        te: "te-IN",
      };

      utterance.lang = langMap[language] || "en-IN";
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      console.error("[VOICE] Speech Recognition not supported in your browser");
      const errorMsg = "Voice input not supported. Please type your question instead.";
      setMessages((prev) => [...prev, {
        id: prev.length + 1,
        text: errorMsg,
        sender: "bot",
        timestamp: new Date(),
        language: language,
      }]);
      return;
    }

    // If already listening, stop it and don't auto-submit
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      console.log("[VOICE] User stopped voice input");
      return;
    }

    // Start listening
    console.log("[VOICE] Starting voice input for language:", language);
    setIsListening(true);
    
    // Set language for speech recognition
    const voiceLanguage = languageMap[language] || "en-IN";
    recognitionRef.current.lang = voiceLanguage;
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    
    let finalTranscript = "";
    let interimTranscript = "";

    recognitionRef.current.onstart = () => {
      console.log("[VOICE] Speech recognition started, language:", voiceLanguage);
      setIsListening(true);
      finalTranscript = "";
      interimTranscript = "";
    };

    recognitionRef.current.onresult = (event) => {
      interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
          console.log("[VOICE] Final result:", transcript);
        } else {
          interimTranscript += transcript;
          console.log("[VOICE] Interim result:", transcript);
        }
      }

      // Display the transcript in input field (final takes precedence)
      const displayText = finalTranscript.trim() || interimTranscript.trim();
      if (displayText) {
        setInputText(displayText);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("[VOICE] Recognition error:", event.error);
      setIsListening(false);
      
      let errorMsg = "Microphone error. Please try again.";
      if (event.error === "no-speech") {
        errorMsg = "No speech detected. Please speak again.";
      } else if (event.error === "network") {
        errorMsg = "Network error. Check your connection.";
      } else if (event.error === "not-allowed") {
        errorMsg = "Microphone access denied. Please allow microphone permission.";
      }
      
      setInputText(""); // Clear any partial input
      setMessages((prev) => [...prev, {
        id: prev.length + 1,
        text: errorMsg,
        sender: "bot",
        timestamp: new Date(),
        language: language,
      }]);
    };

    recognitionRef.current.onend = () => {
      console.log("[VOICE] Speech recognition ended");
      console.log("[VOICE] Final transcript:", finalTranscript.trim());
      setIsListening(false);
      
      // Only keep final transcript, discard interim
      if (finalTranscript.trim()) {
        setInputText(finalTranscript.trim());
      }
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("[VOICE] Error starting recognition:", error);
      setIsListening(false);
      setMessages((prev) => [...prev, {
        id: prev.length + 1,
        text: "Could not start voice input. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        language: language,
      }]);
    }
  };

  const handleQuestionClick = (question) => {
    setInputText(question);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f9f0 0%, #ffffff 100%)",
        py: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 10, sm: 12 },
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: "#2d5016",
              mb: 1,
              fontSize: { xs: "28px", sm: "32px", md: "36px" },
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {getTranslation(language, "chatWithAI")}
          </Typography>
          <Typography
            sx={{
              color: "#3d7e21",
              fontSize: { xs: "14px", sm: "15px" },
              fontWeight: 600,
            }}
          >
            {getTranslation(language, "voiceTextAssistance")}
          </Typography>
        </Box>

        {/* Chat Messages Area */}
        <Paper
          sx={{
            p: { xs: 2, md: 2.5 },
            mb: 2,
            minHeight: "400px",
            maxHeight: "500px",
            overflowY: "auto",
            background: "#f5f9f0",
            border: "3px solid #f57c00",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <SmartToyIcon sx={{ fontSize: 48, color: "#f57c00", mb: 2 }} />
              <Typography sx={{ color: "#999", fontSize: "14px" }}>
                Ready to help! Select a quick question or type yours.
              </Typography>
            </Box>
          )}

          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
                mb: 2,
                animation: "slideUp 0.3s ease-out",
              }}
            >
              {message.sender === "bot" && (
                <SmartToyIcon
                  sx={{
                    color: "#f57c00",
                    mr: 1,
                    mt: 0.5,
                    flexShrink: 0,
                  }}
                />
              )}

              <Card
                sx={{
                  maxWidth: "70%",
                  background:
                    message.sender === "user"
                      ? "linear-gradient(135deg, #f57c00 0%, #ff9800 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f5f9f0 100%)",
                  borderRadius: "12px",
                  border:
                    message.sender === "user"
                      ? "none"
                      : "2px solid #f57c00",
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                  <Typography
                    sx={{
                      color: message.sender === "user" ? "#fff" : "#2d5016",
                      fontSize: { xs: "13px", md: "14px" },
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {message.text}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color:
                        message.sender === "user"
                          ? "rgba(255,255,255,0.7)"
                          : "#999",
                      mt: 0.5,
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </CardContent>
              </Card>

              {message.sender === "user" && (
                <PersonIcon
                  sx={{
                    color: "#f57c00",
                    ml: 1,
                    mt: 0.5,
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Paper>

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <Paper
            sx={{
              p: { xs: 1.5, md: 2 },
              mb: 2,
              background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
              border: "3px solid #ff9800",
              borderRadius: "12px",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: "#888",
                fontWeight: 700,
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              🤔 {getTranslation(language, "quickQuestions")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {(quickQuestions[language] || quickQuestions.en).map((question, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleQuestionClick(question)}
                  sx={{
                    textAlign: "left",
                    justifyContent: "flex-start",
                    px: 2,
                    py: 1,
                    fontSize: { xs: "12px", md: "13px" },
                    color: "#2d5016",
                    border: "2px solid #ff9800",
                    borderRadius: "8px",
                    fontWeight: 600,
                    transition: "all 0.2s",
                    textTransform: "none",
                    "&:hover": {
                      background: "#ff9800",
                      color: "#fff",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {question}
                </Button>
              ))}
            </Box>
          </Paper>
        )}

        {/* Input Area */}
        <Paper
          sx={{
            p: { xs: 1.5, md: 2 },
            background: "linear-gradient(135deg, #ffffff 0%, #f5f9f0 100%)",
            border: "3px solid #f57c00",
            borderRadius: "16px",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <TextField
              fullWidth
              placeholder={getTranslation(language, "typeYourQuestion")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              multiline
              minRows={3}
              maxRows={8}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: { xs: "13px", md: "14px" },
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handleVoiceInput}
                disabled={false}
                sx={{
                  background: isListening
                    ? "#ff9800"
                    : "linear-gradient(135deg, #f57c00 0%, #ff6f00 100%)",
                  color: "#fff",
                  width: { xs: "40px", md: "48px" },
                  height: { xs: "40px", md: "48px" },
                  borderRadius: "8px",
                  transition: "all 0.3s",
                  "&:hover:not(:disabled)": {
                    transform: "scale(1.05)",
                  },
                  animation: isListening ? "pulse 1.5s infinite" : "none",
                }}
                title={getTranslation(language, "voiceInput")}
              >
                <MicIcon sx={{ fontSize: { xs: "18px", md: "20px" } }} />
              </IconButton>

              <IconButton
                onClick={() => speakText(inputText)}
                disabled={!inputText || isSpeaking}
                sx={{
                  background: isSpeaking
                    ? "#ff9800"
                    : "linear-gradient(135deg, #f57c00 0%, #ff6f00 100%)",
                  color: "#fff",
                  width: { xs: "40px", md: "48px" },
                  height: { xs: "40px", md: "48px" },
                  borderRadius: "8px",
                  transition: "all 0.3s",
                  "&:hover:not(:disabled)": {
                    transform: "scale(1.05)",
                  },
                }}
                title={getTranslation(language, "textToSpeech")}
              >
                <VolumeUpIcon sx={{ fontSize: { xs: "18px", md: "20px" } }} />
              </IconButton>
            </Box>

            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #3d7e21 0%, #2d5016 100%)",
                color: "#fff",
                fontWeight: 700,
                px: { xs: 2, md: 3 },
                py: 1,
                borderRadius: "8px",
                fontSize: { xs: "12px", md: "13px" },
                textTransform: "uppercase",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                opacity: !inputText.trim() ? 0.5 : 1,
                cursor: !inputText.trim() ? "not-allowed" : "pointer",
                "&:hover:not(:disabled)": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(45, 80, 22, 0.3)",
                },
              }}
            >
              {getTranslation(language, "send")}
              <SendIcon sx={{ fontSize: "16px" }} />
            </Button>
          </Box>
        </Paper>

        {/* Features Info */}
        <Box sx={{ mt: 4 }}>
          <Typography
            sx={{
              fontWeight: 900,
              color: "#2d5016",
              mb: 2,
              fontSize: { xs: "16px", md: "18px" },
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            ✨ {getTranslation(language, "chatFeatures")}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "3px solid #f57c00",
                  background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "#2d5016",
                      mb: 1,
                      fontSize: { xs: "14px", md: "15px" },
                      textTransform: "uppercase",
                    }}
                  >
                    🎤 {getTranslation(language, "voiceInput")}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, color: "#555" }}>
                    {getTranslation(language, "voiceInputDesc")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "3px solid #f57c00",
                  background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "#2d5016",
                      mb: 1,
                      fontSize: { xs: "14px", md: "15px" },
                      textTransform: "uppercase",
                    }}
                  >
                    🔊 {getTranslation(language, "textToSpeech")}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, color: "#555" }}>
                    {getTranslation(language, "textToSpeechDesc")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "3px solid #f57c00",
                  background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "#2d5016",
                      mb: 1,
                      fontSize: { xs: "14px", md: "15px" },
                      textTransform: "uppercase",
                    }}
                  >
                    🌍 {getTranslation(language, "multilingual")}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, color: "#555" }}>
                    {getTranslation(language, "multilingualDesc")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "3px solid #f57c00",
                  background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "#2d5016",
                      mb: 1,
                      fontSize: { xs: "14px", md: "15px" },
                      textTransform: "uppercase",
                    }}
                  >
                    💬 {getTranslation(language, "simpleLanguage")}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, color: "#555" }}>
                    {getTranslation(language, "simpleLanguageDesc")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
          }
        }
      `}</style>
    </Box>
  );
};

export default ChatNew;
