import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import EventIcon from "@mui/icons-material/Event";
import TimelineIcon from "@mui/icons-material/Timeline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import API from "../services/api";
import { getTranslation } from "../i18n";

function Crops({ lang = "en" }) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get("/api/crops")
      .then((res) => {
        setCrops(res.data.crops || []);
      })
      .catch((err) => {
        console.error("Error fetching crops:", err);
      })
      .finally(() => setLoading(false));
  }, []);

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
          <LocalFloristIcon sx={{ fontSize: 48, color: "#2d5016", mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: "#2d5016" }}>
            {getTranslation(lang, "cropRecommendations")}
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", maxWidth: 600, mx: "auto" }}>
            Select the best crops for your location, season, and farming conditions.
          </Typography>
        </Box>

        {/* Crops Grid */}
        <Grid container spacing={4}>
          {crops.length > 0 ? (
            crops.map((crop, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #c8e6c9",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 48px rgba(45, 80, 22, 0.2)",
                    },
                  }}
                >
                  {/* Image or Placeholder */}
                  <CardMedia
                    sx={{
                      height: 200,
                      background: "linear-gradient(135deg, #4caf50 0%, #7cb342 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <LocalFloristIcon sx={{ fontSize: 80, opacity: 0.8 }} />
                  </CardMedia>

                  {/* Content */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Crop Name */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: "#2d5016",
                      }}
                    >
                      {crop.name}
                    </Typography>

                    {/* Season */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <EventIcon sx={{ fontSize: 20, color: "#f57c00" }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          {getTranslation(lang, "season")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {crop.season}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Duration */}
                    {crop.duration && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <TimelineIcon sx={{ fontSize: 20, color: "#2196f3" }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            {getTranslation(lang, "duration")}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {crop.duration}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Yield */}
                    {crop.yield && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <TrendingUpIcon sx={{ fontSize: 20, color: "#4caf50" }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            {getTranslation(lang, "yield")}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {crop.yield}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Additional Info */}
                    {crop.details && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 1 }}>
                          Details
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.6 }}>
                          {crop.details}
                        </Typography>
                      </Box>
                    )}

                    {/* Suitability Tags */}
                    {crop.water_requirement && (
                      <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip
                          label={crop.water_requirement}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: "#2d5016", color: "#2d5016" }}
                        />
                        {crop.climate && (
                          <Chip
                            label={crop.climate}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: "#7cb342", color: "#7cb342" }}
                          />
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ borderRadius: "12px" }}>
                {getTranslation(lang, "loading")}
              </Alert>
            </Grid>
          )}
        </Grid>

        {/* Info Section */}
        <Box sx={{ mt: 12, pt: 8, borderTop: "2px solid #c8e6c9" }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#2d5016" }}>
                  How to Choose the Right Crop?
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                  <strong>1. Check Your Soil Type:</strong> Different crops thrive in different soil conditions. Choose crops compatible with your soil.
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                  <strong>2. Consider Climate:</strong> Look at rainfall patterns, temperature, and humidity suitable for each crop.
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                  <strong>3. Market Demand:</strong> Choose crops with good market demand in your region.
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
                  <strong>4. Water Availability:</strong> Ensure sufficient water supply for irrigation.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #4caf50 0%, #7cb342 100%)",
                  p: 4,
                  borderRadius: "12px",
                  color: "#fff",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Expert Tips
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                  ✓ Rotate crops annually to maintain soil fertility
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                  ✓ Use disease-resistant varieties
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                  ✓ Plant based on local rainfall patterns
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.95 }}>
                  ✓ Consult local agricultural experts for best results
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Crops;
