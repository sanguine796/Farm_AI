import React, { useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  IconButton,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteIcon from "@mui/icons-material/Delete";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { getTranslation } from "../i18n";

function Chat({ lang = "en" }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const commonQuestions = [
    "Which crop should I grow now?",
    "How to treat leaf rust?",
    "Should I irrigate today?",
    "Best time for harvesting?",
    "How to increase crop yield?",
  ];

  const mockBotResponses = [
    "Based on current weather and soil conditions, I recommend growing rice or wheat for this season. Both crops have good market prices now.",
    "Leaf rust can be treated with copper-based fungicide sprayed every 10 days. Ensure good air circulation to prevent spread.",
    "Avoid irrigation today. Rainfall is expected in the next 24 hours. Check the weather forecast for details.",
    "The best time for harvesting is when the crop is fully mature. Look for moisture content around 15-20% for grains.",
    "To increase crop yield: 1) Use quality seeds, 2) Apply balanced fertilizers, 3) Control pests early, 4) Ensure proper irrigation.",
  ];

  const handleSendMessage = async (text = inputText || transcript) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, userMessage]);
    setInputText("");
    resetTranscript();
    setLoading(true);

    // Simulate bot response with delay
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: mockBotResponses[Math.floor(Math.random() * mockBotResponses.length)],
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleVoiceInput = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser doesn't support speech recognition");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleQuestionClick = (question) => {
    handleSendMessage(question);
  };

  const clearHistory = () => {
    setMessages([]);
    resetTranscript();
  };

  if (!browserSupportsSpeechRecognition && isVoiceMode) {
    return (
      <Box sx={{ background: "linear-gradient(135deg, #f5f9f0 0%, #ffffff 100%)", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: "12px" }}>
            <ChatIcon sx={{ fontSize: 64, color: "#ff9800", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Voice not supported
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
              Your browser doesn't support speech recognition. Please use text mode instead.
            </Typography>
            <Button variant="contained" onClick={() => setIsVoiceMode(false)}>
              {getTranslation(lang, "textChat")}
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "linear-gradient(135deg, #f5f9f0 0%, #ffffff 100%)", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <ChatIcon sx={{ fontSize: 48, color: "#f57c00", mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: "#2d5016" }}>
            {getTranslation(lang, "chatWithAI")}
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Ask any farming question and get instant AI-powered advice.
          </Typography>
        </Box>

        {/* Mode Toggle */}
        <Box sx={{ display: "flex", gap: 2, mb: 4, justifyContent: "center" }}>
          <Chip
            label={getTranslation(lang, "voiceChat")}
            onClick={() => setIsVoiceMode(true)}
            color={isVoiceMode ? "primary" : "default"}
            variant={isVoiceMode ? "filled" : "outlined"}
            icon={<MicIcon />}
          />
          <Chip
            label={getTranslation(lang, "textChat")}
            onClick={() => setIsVoiceMode(false)}
            color={!isVoiceMode ? "primary" : "default"}
            variant={!isVoiceMode ? "filled" : "outlined"}
          />
        </Box>

        {/* Chat Container */}
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "500px",
            borderRadius: "12px",
            border: "1px solid #c8e6c9",
            mb: 3,
          }}
        >
          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "#fafafa",
            }}
          >
            {messages.length === 0 ? (
              <Box sx={{ textAlign: "center", mt: 4, color: "#999" }}>
                <ChatIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
                <Typography variant="body2">
                  {getTranslation(lang, "typeYourQuestion")}
                </Typography>
              </Box>
            ) : (
              messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    sx={{
                      maxWidth: "70%",
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: msg.sender === "user" ? "#2d5016" : "#e8f5e9",
                      color: msg.sender === "user" ? "#fff" : "#1a3a0d",
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mt: 0.5 }}>
                      {msg.timestamp}
                    </Typography>
                  </Paper>
                </Box>
              ))
            )}

            {loading && (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {getTranslation(lang, "loading")}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Transcript Display (Voice Mode) */}
          {isVoiceMode && listening && (
            <Box sx={{ p: 2, backgroundColor: "#fff3e0", borderBottom: "1px solid #ffe0b2" }}>
              <Typography variant="caption" sx={{ color: "#e65100", fontWeight: 600 }}>
                🎤 Listening...
              </Typography>
              {transcript && (
                <Typography variant="body2" sx={{ mt: 1, color: "#333" }}>
                  {transcript}
                </Typography>
              )}
            </Box>
          )}

          {/* Input Area */}
          <Box sx={{ p: 2, display: "flex", gap: 1, alignItems: "flex-end" }}>
            {isVoiceMode ? (
              <>
                <IconButton
                  color={listening ? "error" : "primary"}
                  onClick={handleVoiceInput}
                  size="large"
                  sx={{
                    backgroundColor: listening ? "#ffebee" : "#e8f5e9",
                    "&:hover": {
                      backgroundColor: listening ? "#ffcdd2" : "#c8e6c9",
                    },
                  }}
                >
                  {listening ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
                {transcript && (
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={() => handleSendMessage()}
                    sx={{ flex: 1 }}
                  >
                    {getTranslation(lang, "send")}
                  </Button>
                )}
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  placeholder={getTranslation(lang, "typeYourQuestion")}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  size="small"
                  disabled={loading}
                />
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || loading}
                >
                  {getTranslation(lang, "send")}
                </Button>
              </>
            )}
          </Box>
        </Card>

        {/* Recent Questions */}
        {messages.length === 0 && (
          <Card sx={{ borderRadius: "12px", border: "1px solid #c8e6c9", mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#2d5016" }}>
                {getTranslation(lang, "recentQuestions")}
              </Typography>
              <Grid container spacing={2}>
                {commonQuestions.map((q, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleQuestionClick(q)}
                      sx={{
                        borderColor: "#7cb342",
                        color: "#2d5016",
                        textAlign: "left",
                        justifyContent: "flex-start",
                        textTransform: "capitalize",
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "rgba(124, 179, 66, 0.1)",
                          borderColor: "#558b2f",
                        },
                      }}
                    >
                      {q}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Clear History */}
        {messages.length > 0 && (
          <Box sx={{ textAlign: "center" }}>
            <Button
              startIcon={<DeleteIcon />}
              onClick={clearHistory}
              sx={{ color: "#999" }}
            >
              {getTranslation(lang, "clearHistory")}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Chat;
