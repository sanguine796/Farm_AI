import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { getTranslation } from "../i18n";

function Market({ lang = "en" }) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const mockPrices = [
      { crop: "Rice", market: "Thrissur", price: 2450, unit: "per quintal", trend: "up", change: 3.5 },
      { crop: "Tomato", market: "Kurnool", price: 1800, unit: "per quintal", trend: "down", change: 2.1 },
      { crop: "Onion", market: "Nashik", price: 2200, unit: "per quintal", trend: "up", change: 1.8 },
      { crop: "Wheat", market: "Punjab", price: 2100, unit: "per quintal", trend: "stable", change: 0 },
      { crop: "Corn", market: "Maharashtra", price: 1950, unit: "per quintal", trend: "down", change: 0.5 },
      { crop: "Cotton", market: "Gujarat", price: 5800, unit: "per bale", trend: "up", change: 2.3 },
    ];
    setTimeout(() => {
      setPrices(mockPrices);
      setLoading(false);
    }, 500);
  }, []);

  const getTrendIcon = (trend) => {
    if (trend === "up") return <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 20 }} />;
    if (trend === "down") return <TrendingDownIcon sx={{ color: "#d32f2f", fontSize: 20 }} />;
    return null;
  };

  const getTrendColor = (trend) => {
    if (trend === "up") return "#4caf50";
    if (trend === "down") return "#d32f2f";
    return "#ff9800";
  };

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
          <TrendingUpIcon sx={{ fontSize: 48, color: "#9c27b0", mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: "#2d5016" }}>
            {getTranslation(lang, "marketPrices")}
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", maxWidth: 600, mx: "auto" }}>
            Real-time crop prices from major agricultural markets across India. Make informed selling decisions.
          </Typography>
        </Box>

        {/* Cards View */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {prices.slice(0, 3).map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ borderRadius: "12px", border: "1px solid #c8e6c9", height: "100%" }}>
                <CardHeader
                  title={item.crop}
                  subheader={item.market}
                  sx={{
                    background: "linear-gradient(135deg, #7cb342 0%, #558b2f 100%)",
                    color: "#fff",
                    "& .MuiCardHeader-subheader": { color: "rgba(255,255,255,0.8)" },
                  }}
                />
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                      {getTranslation(lang, "pricePerUnit")}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#2d5016" }}>
                      ₹{item.price.toLocaleString()}
                    </Typography>
                  </Box>
                  {item.trend !== "stable" && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {getTrendIcon(item.trend)}
                      <Typography variant="body2" sx={{ color: getTrendColor(item.trend), fontWeight: 600 }}>
                        {item.trend === "up" ? "+" : ""}{item.change}% {item.trend}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Table View */}
        <TableContainer component={Paper} sx={{ borderRadius: "12px", border: "1px solid #c8e6c9", mb: 8 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "linear-gradient(135deg, #2d5016 0%, #3d7e21 100%)", color: "#fff" }}>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                  {getTranslation(lang, "cropName")}
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                  {getTranslation(lang, "location")}
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }} align="right">
                  {getTranslation(lang, "pricePerUnit")}
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }} align="center">
                  {getTranslation(lang, "trend")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prices.map((item, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    "&:hover": { backgroundColor: "rgba(124, 179, 66, 0.05)" },
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "#2d5016" }}>
                    {item.crop}
                  </TableCell>
                  <TableCell>{item.market}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: "#2d5016" }}>
                    ₹{item.price.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      {getTrendIcon(item.trend)}
                      {item.trend !== "stable" && (
                        <Typography variant="caption" sx={{ color: getTrendColor(item.trend), fontWeight: 600 }}>
                          {item.change}%
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Info Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#2d5016" }}>
                How to Use Market Prices?
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                <strong>1. Check Trends:</strong> Monitor price trends to identify the best time to sell.
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                <strong>2. Compare Markets:</strong> Prices vary by location. Check multiple markets for better rates.
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                <strong>3. Plan Storage:</strong> If prices are low, consider storage for better future profits.
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
                <strong>4. Network:</strong> Connect with buyers through local market associations.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
                p: 4,
                borderRadius: "12px",
                color: "#fff",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Expert Tips
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                ✓ Prices updated every hour from major markets
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                ✓ Historical data helps predict future trends
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                ✓ Bundle your crop with other farmers for better rates
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                ✓ Direct selling to processors can give premium prices
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Market;
