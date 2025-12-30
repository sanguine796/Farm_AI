import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  CircularProgress,
  Paper,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import OpacityIcon from "@mui/icons-material/Opacity";
import AirIcon from "@mui/icons-material/Air";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { getTranslation } from "../i18n";

const mockWeatherData = [
  {
    day: "Monday",
    date: "Dec 28",
    temp: 30,
    humidity: 65,
    rain: 10,
    wind: 12,
    condition: "Partly Cloudy",
    icon: <CloudIcon sx={{ fontSize: 48, color: "#2196f3" }} />,
    advice: "Good day for irrigation. Morning is ideal.",
  },
  {
    day: "Tuesday",
    date: "Dec 29",
    temp: 32,
    humidity: 55,
    rain: 0,
    wind: 8,
    condition: "Sunny",
    icon: <WbSunnyIcon sx={{ fontSize: 48, color: "#fbc02d" }} />,
    advice: "Avoid spraying pesticides. High UV radiation.",
  },
  {
    day: "Wednesday",
    date: "Dec 30",
    temp: 28,
    humidity: 75,
    rain: 25,
    wind: 15,
    condition: "Light Rain",
    icon: <ThunderstormIcon sx={{ fontSize: 48, color: "#ff9800" }} />,
    advice: "Do not irrigate. Rainfall expected.",
  },
  {
    day: "Thursday",
    date: "Dec 31",
    temp: 31,
    humidity: 60,
    rain: 5,
    wind: 10,
    condition: "Clear",
    icon: <WbSunnyIcon sx={{ fontSize: 48, color: "#fbc02d" }} />,
    advice: "Perfect day for fertilizer application.",
  },
  {
    day: "Friday",
    date: "Jan 1",
    temp: 29,
    humidity: 70,
    rain: 15,
    wind: 14,
    condition: "Cloudy",
    icon: <CloudIcon sx={{ fontSize: 48, color: "#90caf9" }} />,
    advice: "Monitor for pest activity. Humidity is high.",
  },
  {
    day: "Saturday",
    date: "Jan 2",
    temp: 33,
    humidity: 50,
    rain: 0,
    wind: 6,
    condition: "Sunny",
    icon: <WbSunnyIcon sx={{ fontSize: 48, color: "#fbc02d" }} />,
    advice: "Excellent for harvesting. Low humidity.",
  },
  {
    day: "Sunday",
    date: "Jan 3",
    temp: 27,
    humidity: 80,
    rain: 40,
    wind: 18,
    condition: "Heavy Rain",
    icon: <ThunderstormIcon sx={{ fontSize: 48, color: "#d32f2f" }} />,
    advice: "Strong winds expected. Secure loose structures.",
  },
];

const Weather = ({ lang = "en" }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setWeatherData(mockWeatherData);
      setLoading(false);
    }, 500);
  }, [mockWeatherData]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: "linear-gradient(135deg, #f5f9f0 0%, #ffffff 100%)", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <CloudIcon sx={{ fontSize: 48, color: "#2196f3", mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: "#2d5016" }}>
            {getTranslation(lang, "weatherAdvisory")}
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", maxWidth: 600, mx: "auto" }}>
            7-day weather forecast with farming-specific advisories to help you make the best agricultural decisions.
          </Typography>
        </Box>

        {/* Weather Cards Grid */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {weatherData.map((weather, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{
                  borderRadius: "12px",
                  border: "1px solid #c8e6c9",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 48px rgba(45, 80, 22, 0.2)",
                  },
                }}
              >
                <CardHeader
                  title={weather.day}
                  subheader={weather.date}
                  sx={{
                    background: "linear-gradient(135deg, #2d5016 0%, #3d7e21 100%)",
                    color: "#fff",
                    "& .MuiCardHeader-subheader": { color: "rgba(255,255,255,0.8)" },
                    textAlign: "center",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Weather Icon */}
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    {weather.icon}
                  </Box>

                  {/* Condition */}
                  <Typography
                    variant="body1"
                    sx={{ textAlign: "center", fontWeight: 600, color: "#2d5016", mb: 3 }}
                  >
                    {weather.condition}
                  </Typography>

                  {/* Temperature */}
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#2d5016" }}>
                      {weather.temp}°C
                    </Typography>
                  </Box>

                  {/* Weather Details */}
                  <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {/* Humidity */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <OpacityIcon sx={{ color: "#2196f3", fontSize: 24 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          {getTranslation(lang, "humidity")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {weather.humidity}%
                        </Typography>
                      </Box>
                    </Box>

                    {/* Rainfall */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <ThunderstormIcon sx={{ color: "#ff9800", fontSize: 24 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          {getTranslation(lang, "rainfall")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {weather.rain}mm
                        </Typography>
                      </Box>
                    </Box>

                    {/* Wind Speed */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <AirIcon sx={{ color: "#7cb342", fontSize: 24 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          {getTranslation(lang, "windSpeed")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {weather.wind} km/h
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Farming Advice */}
                  <Paper
                    sx={{
                      background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)",
                      p: 2,
                      borderRadius: "8px",
                      borderLeft: "4px solid #4caf50",
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "#2d5016", fontWeight: 600 }}>
                      💡 {getTranslation(lang, "advisory")}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#556b2f", lineHeight: 1.5, mt: 1 }}>
                      {weather.advice}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Info Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#2d5016" }}>
                How to Interpret Weather Data
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                <strong>Temperature:</strong> Affects plant growth, pest activity, and irrigation needs.
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                <strong>Humidity:</strong> High humidity promotes fungal diseases. Ensure good air circulation.
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                <strong>Rainfall:</strong> Check forecast before irrigation to avoid waterlogging.
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
                <strong>Wind Speed:</strong> Affects spray drift. Apply pesticides only in calm conditions.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
                p: 4,
                borderRadius: "12px",
                color: "#fff",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Seasonal Farming Tips
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                ✓ Monitor weather 10 days in advance for planning
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                ✓ Adjust irrigation based on rainfall predictions
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                ✓ Schedule pesticide spraying on windless days
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                ✓ Prepare drainage for heavy rainfall periods
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Weather;
