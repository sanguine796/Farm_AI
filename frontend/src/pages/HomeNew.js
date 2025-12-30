import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloudIcon from "@mui/icons-material/Cloud";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ChatIcon from "@mui/icons-material/Chat";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { useLanguage } from "../LanguageContext";
import { getTranslation } from "../i18n";
import vietnamBackground from "../assets/vietnam-9831328_1920.png";

const HomeNew = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [weather] = useState({
    temp: 28,
    condition: "Partly Cloudy",
    humidity: 72,
    rainfall: 5,
  });

  useEffect(() => {
    // Simulate loading
  }, []);

  const quickAccessCards = [
    {
      id: "crops",
      label: getTranslation(language, "cropTitle"),
      icon: <AgricultureIcon sx={{ fontSize: 48 }} />,
      color: "#4caf50",
      path: "/crops",
      description: getTranslation(language, "cropDesc"),
    },
    {
      id: "pest",
      label: getTranslation(language, "pestTitle"),
      icon: <BugReportIcon sx={{ fontSize: 48 }} />,
      color: "#ff9800",
      path: "/pest",
      description: getTranslation(language, "pestDesc"),
    },
    {
      id: "weather",
      label: getTranslation(language, "weatherTitle"),
      icon: <CloudIcon sx={{ fontSize: 48 }} />,
      color: "#2196f3",
      path: "/weather",
      description: getTranslation(language, "weatherDesc"),
    },
    {
      id: "market",
      label: getTranslation(language, "marketTitle"),
      icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
      color: "#9c27b0",
      path: "/market",
      description: getTranslation(language, "marketDesc"),
    },
    {
      id: "chat",
      label: getTranslation(language, "chatTitle"),
      icon: <ChatIcon sx={{ fontSize: 48 }} />,
      color: "#f57c00",
      path: "/chat",
      description: getTranslation(language, "chatDesc"),
    },
  ];

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.35) 100%), url(${vietnamBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        minHeight: "calc(100vh - 140px)",
        py: { xs: 3, sm: 6 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.08) 100%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            mb: 8,
            textAlign: "center",
            animation: "slideDown 0.6s ease-out",
            "@keyframes slideDown": {
              from: { opacity: 0, transform: "translateY(-30px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
            background: "rgba(255, 255, 255, 0.85)",
            borderRadius: "20px",
            p: { xs: 3, sm: 4 },
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(76, 175, 80, 0.2)",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 28, sm: 40, md: 48 },
              fontWeight: 900,
              color: "#2d5016",
              mb: 1,
              letterSpacing: 1,
              textShadow: "2px 2px 4px rgba(45,80,22,0.1)",
            }}
          >
            {getTranslation(language, "welcome")} 🌾
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 16, sm: 20 },
              color: "#558b2f",
              fontWeight: 600,
              mb: 4,
              letterSpacing: 0.3,
            }}
          >
            {getTranslation(language, "subtitle")}
          </Typography>
        </Box>

        {/* Weather Summary Card */}
        <Paper
          elevation={3}
          sx={{
            background: "linear-gradient(135deg, #7cb342 0%, #558b2f 100%)",
            color: "#fff",
            borderRadius: "16px",
            p: { xs: 3, sm: 4 },
            mb: 6,
            boxShadow: "0 8px 32px rgba(45,80,22,0.15)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  fontSize: { xs: 18, sm: 24 },
                  fontWeight: 800,
                  mb: 3,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {getTranslation(language, "todaysWeather")}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
                    <ThermostatIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography sx={{ fontSize: 12, opacity: 0.9 }}>{getTranslation(language, "temperature")}</Typography>
                      <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
                        {weather.temp}°C
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
                    <OpacityIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography sx={{ fontSize: 12, opacity: 0.9 }}>{getTranslation(language, "humidity")}</Typography>
                      <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
                        {weather.humidity}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
                    <CloudIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography sx={{ fontSize: 12, opacity: 0.9 }}>Weather</Typography>
                      <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                        {weather.condition}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <WbSunnyIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography sx={{ fontSize: 12, opacity: 0.9 }}>{getTranslation(language, "rainfall")}</Typography>
                      <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
                        {weather.rainfall}mm
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: { xs: "left", sm: "center" } }}>
              <Button
                variant="contained"
                onClick={() => navigate("/weather")}
                sx={{
                  background: "#fff",
                  color: "#2d5016",
                  fontWeight: 700,
                  fontSize: 16,
                  py: 2,
                  px: 4,
                  borderRadius: "10px",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                {getTranslation(language, "viewForecast")} →
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Access Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 22, sm: 28 },
              fontWeight: 800,
              color: "#2d5016",
              mb: 4,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {getTranslation(language, "quickAccess")}
          </Typography>

          <Grid container spacing={3}>
            {quickAccessCards.map((card, idx) => (
              <Grid item xs={12} sm={6} md={4} key={card.id}>
                <Card
                  onClick={() => navigate(card.path)}
                  sx={{
                    height: "100%",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: `3px solid ${card.color}`,
                    background: "#fff",
                    overflow: "hidden",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, ${card.color}, transparent)`,
                    },
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 16px 48px ${card.color}40`,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      p: { xs: 2.5, sm: 3.5 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        background: `${card.color}15`,
                        color: card.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: { xs: 18, sm: 20 },
                          color: "#2d5016",
                          mb: 0.5,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {card.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#666",
                          fontWeight: 500,
                        }}
                      >
                        {card.description}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        color: card.color,
                        borderColor: card.color,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: 12,
                        py: 1.2,
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: card.color,
                          color: "#fff",
                        },
                      }}
                    >
                      Open →
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #2d5016 0%, #3d7e21 100%)",
            color: "#fff",
            borderRadius: "16px",
            p: { xs: 3, sm: 5 },
            mt: 6,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 28 },
              fontWeight: 800,
              mb: 3,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {getTranslation(language, "whyFarmAI")}
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: "Voice First", desc: "Speak in your language" },
              { title: "AI Powered", desc: "Real-time insights" },
              { title: "Works Offline", desc: "Low connectivity friendly" },
              { title: "Farmer Focused", desc: "Simple & easy to use" },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1 }}>
                    ✓ {item.title}
                  </Typography>
                  <Typography sx={{ fontSize: 13, opacity: 0.9 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeNew;
