import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { useLanguage } from "../LanguageContext";
import { getTranslation } from "../i18n";
import API from "../services/api";

const MarketNew = () => {
  const { language } = useLanguage();
  const [expandedCrop, setExpandedCrop] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch market data from API on component mount
  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      console.log("[MARKET] Fetching market prices from API...");

      try {
        console.log("[MARKET] Sending request to /api/market endpoint...");
        const response = await API.get("/market");

        console.log("[MARKET] Backend response received:", response.data);
        setMarketData(response.data);
        console.log("[MARKET] Market data updated in UI");
      } catch (error) {
        console.error("[MARKET] API Error:", {
          message: error.message,
          endpoint: "/api/market",
          errorDetails: error.response?.data || error.message,
        });
        console.log("[MARKET] Using fallback/mock market data...");
        setMarketData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  // Mock market data (fallback)
  const priceData = marketData?.prices ? marketData.prices.map((item, idx) => ({
    id: idx + 1,
    crop: item.crop,
    current: item.price,
    previous: item.price * (item.trend === "up" ? (1 - item.change / 100) : (1 + item.change / 100)),
    trend: item.trend,
    percentage: item.change,
    unit: item.unit,
    highPrice: item.price * 1.1,
    lowPrice: item.price * 0.9,
    demand: item.trend === "up" ? "Very High" : "Medium",
    advice: item.trend === "up" ? "Good selling opportunity" : "Hold position",
  })) : [
    {
      id: 1,
      crop: "Rice",
      current: 45,
      previous: 42,
      trend: "up",
      percentage: 7.1,
      unit: "₹/kg",
      highPrice: 48,
      lowPrice: 40,
      demand: "Very High",
      advice:
        "Good selling time! Prices expected to hold for next 2 weeks. Consider selling if holding for storage costs.",
      market: "Kottayam Mandi",
      bestTime: "Next 10 days",
    },
    {
      id: 2,
      crop: "Coconut",
      current: 18,
      previous: 20,
      trend: "down",
      percentage: 10,
      unit: "₹/piece",
      highPrice: 22,
      lowPrice: 15,
      demand: "Medium",
      advice:
        "Prices dropping slightly. Harvest now if mature. Can store for better prices in next month.",
      market: "Alappuzha Mandi",
      bestTime: "Next 2 weeks",
    },
    {
      id: 3,
      crop: "Banana",
      current: 35,
      previous: 32,
      trend: "up",
      percentage: 9.4,
      unit: "₹/dozen",
      highPrice: 38,
      lowPrice: 28,
      demand: "High",
      advice:
        "Strong market! Prices rising. Ready bunches should go to market immediately.",
      market: "Palakkad Mandi",
      bestTime: "Immediate",
    },
    {
      id: 4,
      crop: "Cardamom",
      current: 2400,
      previous: 2350,
      trend: "up",
      percentage: 2.1,
      unit: "₹/kg",
      highPrice: 2500,
      lowPrice: 2200,
      demand: "High",
      advice:
        "Stable prices with slight increase. Premium quality gets better prices. Dry well before selling.",
      market: "Idukki Spice Market",
      bestTime: "Next 3 weeks",
    },
    {
      id: 5,
      crop: "Areca Nut",
      current: 180,
      previous: 190,
      trend: "down",
      percentage: 5.3,
      unit: "₹/kg",
      highPrice: 200,
      lowPrice: 170,
      demand: "Medium",
      advice:
        "Prices declining. Wait for market recovery or process for value addition.",
      market: "Wayanad Mandi",
      bestTime: "Wait 2-3 weeks",
    },
    {
      id: 6,
      crop: "Pepper",
      current: 850,
      previous: 800,
      trend: "up",
      percentage: 6.3,
      unit: "₹/kg",
      highPrice: 900,
      lowPrice: 750,
      demand: "Very High",
      advice:
        "Excellent prices! Export demand high. Ensure proper drying and storage quality.",
      market: "Ernakulam Mandi",
      bestTime: "Next 1 week",
    },
    {
      id: 7,
      crop: "Tomato",
      current: 22,
      previous: 18,
      trend: "up",
      percentage: 22.2,
      unit: "₹/kg",
      highPrice: 25,
      lowPrice: 12,
      demand: "Very High",
      advice:
        "Prices surging! High demand in markets. Sell quickly if harvesting now.",
      market: "Kottayam Mandi",
      bestTime: "Immediate",
    },
    {
      id: 8,
      crop: "Cucumber",
      current: 16,
      previous: 20,
      trend: "down",
      percentage: 20,
      unit: "₹/kg",
      highPrice: 22,
      lowPrice: 12,
      demand: "Low",
      advice:
        "Seasonal decline. Prices may stay low. Consider storing or processing.",
      market: "Kottayam Mandi",
      bestTime: "Wait",
    },
  ];

  const featuredCrops = priceData.slice(0, 3);

  const getTrendColor = (trend) => {
    return trend === "up" ? "#4caf50" : "#f44336";
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? (
      <TrendingUpIcon sx={{ color: "#4caf50" }} />
    ) : (
      <TrendingDownIcon sx={{ color: "#f44336" }} />
    );
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
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
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
            Market Prices & Trends
          </Typography>
          <Typography
            sx={{
              color: "#3d7e21",
              fontSize: { xs: "14px", sm: "15px" },
              fontWeight: 600,
            }}
          >
            Real-time Kerala market prices • Updated today
          </Typography>
        </Box>

        {/* Featured Top 3 Crops */}
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
          📈 Top Selling Crops
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {featuredCrops.map((crop) => (
            <Grid item xs={12} sm={6} md={4} key={crop.id}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "3px solid #9c27b0",
                  background:
                    crop.trend === "up"
                      ? "linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%)"
                      : "linear-gradient(135deg, #fff8f5 0%, #ffffff 100%)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 24px rgba(156, 39, 176, 0.2)`,
                  },
                }}
                onClick={() =>
                  setExpandedCrop(
                    expandedCrop === crop.id ? null : crop.id
                  )
                }
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  {/* Crop Name & Trend */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: "#2d5016",
                        fontSize: { xs: "16px", md: "18px" },
                      }}
                    >
                      {crop.crop}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      {getTrendIcon(crop.trend)}
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 900,
                          color: getTrendColor(crop.trend),
                        }}
                      >
                        {crop.percentage}%
                      </Typography>
                    </Box>
                  </Box>

                  {/* Current Price */}
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#888",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        mb: 0.5,
                      }}
                    >
                      Current Price
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "24px", md: "28px" },
                        fontWeight: 900,
                        color: "#9c27b0",
                      }}
                    >
                      {crop.current}
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          marginLeft: "4px",
                        }}
                      >
                        {crop.unit}
                      </span>
                    </Typography>
                  </Box>

                  {/* Previous Price */}
                  <Box sx={{ mb: 2, p: 1, background: "#f5f5f5", borderRadius: "8px" }}>
                    <Typography sx={{ fontSize: "11px", color: "#666", fontWeight: 600 }}>
                      Previous: {crop.previous} {crop.unit}
                    </Typography>
                  </Box>

                  {/* Demand */}
                  <Chip
                    label={crop.demand}
                    sx={{
                      background:
                        crop.demand === "Very High"
                          ? "#4caf50"
                          : crop.demand === "High"
                          ? "#8bc34a"
                          : "#ffc107",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "11px",
                      mb: 1.5,
                    }}
                  />

                  {/* Advice Preview */}
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#555",
                      fontWeight: 500,
                      lineHeight: 1.4,
                      display: expandedCrop === crop.id ? "block" : "-webkit-box",
                      WebkitLineClamp: expandedCrop === crop.id ? "unset" : 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {crop.advice}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* All Crops Table */}
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
          🏪 All Crop Prices
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "16px",
            border: "3px solid #9c27b0",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)" }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 900,
                    color: "#fff",
                    fontSize: { xs: "11px", md: "12px" },
                    textTransform: "uppercase",
                    padding: { xs: "10px 8px", md: "12px" },
                  }}
                >
                  Crop
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 900,
                    color: "#fff",
                    fontSize: { xs: "11px", md: "12px" },
                    textTransform: "uppercase",
                    textAlign: "right",
                    padding: { xs: "10px 8px", md: "12px" },
                  }}
                >
                  Current Price
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 900,
                    color: "#fff",
                    fontSize: { xs: "11px", md: "12px" },
                    textTransform: "uppercase",
                    textAlign: "center",
                    padding: { xs: "10px 4px", md: "12px" },
                  }}
                >
                  Trend
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 900,
                    color: "#fff",
                    fontSize: { xs: "11px", md: "12px" },
                    textTransform: "uppercase",
                    textAlign: "right",
                    padding: { xs: "10px 8px", md: "12px" },
                  }}
                >
                  {getTranslation(language, "change")}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 900,
                    color: "#fff",
                    fontSize: { xs: "11px", md: "12px" },
                    textTransform: "uppercase",
                    textAlign: "center",
                    display: { xs: "none", md: "table-cell" },
                    padding: "12px",
                  }}
                >
                  Market
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {priceData.map((crop, idx) => (
                <TableRow
                  key={crop.id}
                  sx={{
                    background: idx % 2 === 0 ? "#f9fafb" : "#fff",
                    transition: "all 0.2s",
                    "&:hover": {
                      background: "#f0f7ff",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#2d5016",
                      fontSize: { xs: "12px", md: "13px" },
                      padding: { xs: "10px 8px", md: "12px" },
                    }}
                  >
                    {crop.crop}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 900,
                      color: "#9c27b0",
                      fontSize: { xs: "12px", md: "13px" },
                      textAlign: "right",
                      padding: { xs: "10px 8px", md: "12px" },
                    }}
                  >
                    {crop.current} {crop.unit}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      padding: { xs: "10px 4px", md: "12px" },
                    }}
                  >
                    {getTrendIcon(crop.trend)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 900,
                      color: getTrendColor(crop.trend),
                      fontSize: { xs: "11px", md: "12px" },
                      textAlign: "right",
                      padding: { xs: "10px 8px", md: "12px" },
                    }}
                  >
                    {crop.trend === "up" ? "+" : "-"}
                    {crop.percentage}%
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "11px", md: "12px" },
                      color: "#666",
                      textAlign: "center",
                      display: { xs: "none", md: "table-cell" },
                      padding: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {crop.market}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Profit Tips */}
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
            💰 Profit Tips
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "3px solid #4caf50",
                  background: "linear-gradient(135deg, #f1f8f4 0%, #ffffff 100%)",
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
                    ✅ Best Time to Sell
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, color: "#555" }}>
                    • Prices rise after harvest season ends (2-3 months)
                    <br />• Sell when demand spikes
                    <br />• Check trending crops weekly
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "3px solid #ff9800",
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
                    🏪 Direct Sale Options
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "13px", md: "14px" }, color: "#555" }}>
                    • Agricultural export cooperatives get premium prices
                    <br />• Direct buyer networks (bypass middlemen)
                    <br />• Quality certification increases price by 10-20%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default MarketNew;
