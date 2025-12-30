import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloudIcon from "@mui/icons-material/Cloud";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ChatIcon from "@mui/icons-material/Chat";
import SchoolIcon from "@mui/icons-material/School";
import { getTranslation } from "../i18n";

function Home({ lang = "en" }) {
  const navigate = useNavigate();

  const features = [
    {
      id: "crops",
      icon: <AgricultureIcon sx={{ fontSize: 48 }} />,
      title: getTranslation(lang, "cropTitle"),
      description: getTranslation(lang, "cropDesc"),
      color: "#4caf50",
      path: "/crops",
    },
    {
      id: "pest",
      icon: <BugReportIcon sx={{ fontSize: 48 }} />,
      title: getTranslation(lang, "pestTitle"),
      description: getTranslation(lang, "pestDesc"),
      color: "#ff9800",
      path: "/pest",
    },
    {
      id: "weather",
      icon: <CloudIcon sx={{ fontSize: 48 }} />,
      title: getTranslation(lang, "weatherTitle"),
      description: getTranslation(lang, "weatherDesc"),
      color: "#2196f3",
      path: "/weather",
    },
    {
      id: "market",
      icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
      title: getTranslation(lang, "marketTitle"),
      description: getTranslation(lang, "marketDesc"),
      color: "#9c27b0",
      path: "/market",
    },
    {
      id: "chat",
      icon: <ChatIcon sx={{ fontSize: 48 }} />,
      title: getTranslation(lang, "chatTitle"),
      description: getTranslation(lang, "chatDesc"),
      color: "#f57c00",
      path: "/chat",
    },
    {
      id: "learn",
      icon: <SchoolIcon sx={{ fontSize: 48 }} />,
      title: "Learning Hub",
      description: "Educational resources and farming guides for better yields",
      color: "#00bcd4",
      path: "/learn",
      disabled: true,
    },
  ];

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f9f0 0%, #ffffff 100%)",
        minHeight: "100vh",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.05)" },
              },
            }}
          >
            <AgricultureIcon sx={{ fontSize: 64, color: "#2d5016" }} />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            {getTranslation(lang, "welcome")} 🌾
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: "#558b2f",
              mb: 3,
              fontWeight: 500,
              fontSize: { xs: "1rem", md: "1.3rem" },
            }}
          >
            {getTranslation(lang, "subtitle")}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#666",
              maxWidth: 600,
              mx: "auto",
              mb: 4,
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              lineHeight: 1.8,
            }}
          >
            {getTranslation(lang, "tagline")}
          </Typography>
        </Box>

        {/* Feature Cards Grid */}
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
                  border: `2px solid ${feature.color}22`,
                  opacity: feature.disabled ? 0.7 : 1,
                  cursor: feature.disabled ? "not-allowed" : "pointer",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: feature.color,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                  {/* Icon with Background */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mb: 2,
                      color: feature.color,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: `${feature.color}15`,
                        borderRadius: "12px",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {feature.icon}
                    </Box>
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      textAlign: "center",
                      color: "#1a3a0d",
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      color: "#666",
                      lineHeight: 1.6,
                      minHeight: "50px",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "center", pb: 3 }}>
                  <Button
                    variant="contained"
                    disabled={feature.disabled}
                    onClick={() => !feature.disabled && navigate(feature.path)}
                    sx={{
                      background: feature.disabled
                        ? "#ccc"
                        : `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)`,
                      color: "#fff",
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      textTransform: "capitalize",
                      borderRadius: "8px",
                      "&:hover": !feature.disabled && {
                        transform: "translateY(-2px)",
                        boxShadow: `0 12px 32px ${feature.color}44`,
                      },
                    }}
                  >
                    {feature.disabled ? "Coming Soon" : getTranslation(lang, "explore")}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 12, pt: 8, borderTop: "2px solid #c8e6c9" }}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", mb: 6, fontWeight: 700, color: "#2d5016" }}
          >
            Why Choose AI Farming Assistant?
          </Typography>

          <Grid container spacing={4}>
            {[
              { title: "🎯 Targeted Recommendations", desc: "Get personalized suggestions based on your location and crops" },
              { title: "📱 Simple Interface", desc: "Easy to use even with basic smartphone literacy" },
              { title: "🌐 Multi-Language Support", desc: "Available in 7 Indian languages" },
              { title: "⚡ Real-Time Updates", desc: "Weather forecasts and market prices updated hourly" },
              { title: "🔒 Your Data is Safe", desc: "Fully encrypted and secure operations" },
              { title: "💰 Free to Use", desc: "No hidden charges or premium subscriptions" },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#2d5016" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            mt: 12,
            p: 6,
            background: "linear-gradient(135deg, #2d5016 0%, #3d7e21 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Transform Your Farming?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Start with crop recommendations and discover how AI can help you make better decisions.
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fff",
              color: "#2d5016",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
            onClick={() => navigate("/crops")}
          >
            {getTranslation(lang, "explore")} Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
