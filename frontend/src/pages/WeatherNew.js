import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import API from "../services/api";

const WeatherNew = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [selectedState, setSelectedState] = useState("maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState("nagpur");

  // Pan-India State and District mapping
  const stateDistrictMap = {
    "andhra-pradesh": {
      name: "Andhra Pradesh",
      districts: ["Nellore", "Chittoor", "Anantapur", "Kadapa", "Kurnool", "Prakasam"],
    },
    maharashtra: {
      name: "Maharashtra",
      districts: ["Nagpur", "Wardha", "Aurangabad", "Ahmednagar", "Solapur", "Kolhapur"],
    },
    karnataka: {
      name: "Karnataka",
      districts: ["Belgaum", "Belagavi", "Hubballi", "Dharwad", "Haveri", "Shimoga"],
    },
    kerala: {
      name: "Kerala",
      districts: ["Kottayam", "Ernakulam", "Idukki", "Thrissur", "Palakkad", "Malappuram"],
    },
    punjab: {
      name: "Punjab",
      districts: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Sangrur"],
    },
    "tamil-nadu": {
      name: "Tamil Nadu",
      districts: ["Coimbatore", "Madurai", "Salem", "Tiruppur", "Erode", "Kanyakumari"],
    },
    telangana: {
      name: "Telangana",
      districts: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Medak", "Nalgonda"],
    },
    uttar_pradesh: {
      name: "Uttar Pradesh",
      districts: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Allahabad"],
    },
    rajasthan: {
      name: "Rajasthan",
      districts: ["Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Bikaner", "Kota"],
    },
    "madhya-pradesh": {
      name: "Madhya Pradesh",
      districts: ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
    },
  };

  const getDistrictsForState = (state) => {
    return stateDistrictMap[state]?.districts || [];
  };
  
  const generateForecastDate = useCallback((daysOffset) => {
    const today = new Date();
    const date = new Date(today);
    date.setDate(date.getDate() + daysOffset);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }, []);

  // Simulate weather data with realistic variations
  const getWeatherForDay = useCallback((dayOffset) => {
    const baseTemp = 28 + (Math.random() * 8 - 4); // 24-32°C
    const conditions = [
      { name: "Sunny", icon: "☀️", rainfall: 0, humidity: 58 },
      { name: "Partly Cloudy", icon: "⛅", rainfall: 3, humidity: 65 },
      { name: "Cloudy", icon: "☁️", rainfall: 8, humidity: 72 },
      { name: "Rainy", icon: "🌧️", rainfall: 20, humidity: 85 },
      { name: "Heavy Rain", icon: "⛈️", rainfall: 35, humidity: 90 },
    ];
    const selected = conditions[Math.floor(Math.random() * conditions.length)];
    return {
      temp: Math.round(baseTemp),
      condition: selected.name,
      rainfall: selected.rainfall,
      humidity: selected.humidity,
      windSpeed: 10 + Math.floor(Math.random() * 15),
      icon: selected.icon,
    };
  }, []);

  // Fetch weather data from API when state/district changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchWeatherData = async () => {
      console.log(`[WEATHER] Fetching weather data for ${selectedDistrict}, ${stateDistrictMap[selectedState].name}...`);

      try {
        console.log(`[WEATHER] Sending request to /api/weather endpoint with location...`);
        const response = await API.get("/weather", {
          params: {
            state: selectedState,
            district: selectedDistrict,
            region: `${selectedDistrict}, ${stateDistrictMap[selectedState].name}`,
          },
        });

        console.log("[WEATHER] Backend response received:", response.data);
        setWeatherData(response.data);
        console.log("[WEATHER] Weather data updated in UI");
      } catch (error) {
        console.error("[WEATHER] API Error:", {
          message: error.message,
          endpoint: "/api/weather",
          errorDetails: error.response?.data || error.message,
        });

        // Use fallback data
        console.log("[WEATHER] Using fallback/simulated weather data...");
        const currentWeather = getWeatherForDay(0);
        setWeatherData({
          region: `${selectedDistrict}, ${stateDistrictMap[selectedState].name}`,
          current: currentWeather,
          forecast: Array.from({ length: 7 }, (_, i) => ({
            date: generateForecastDate(i),
            ...getWeatherForDay(i),
          })),
        });
      }
    };

    fetchWeatherData();
  }, [selectedState, selectedDistrict, getWeatherForDay, generateForecastDate]);

  const currentWeather = weatherData?.current || getWeatherForDay(0);

  const forecastData = weatherData?.forecast || Array.from({ length: 7 }, (_, i) => {
    const dayNames = ["Tomorrow", "Day After", "In 3 Days", "In 4 Days", "In 5 Days", "In 6 Days", "In 7 Days"];
    const weather = getWeatherForDay(i + 1);
    
    const adviceMap = {
      "Sunny": "Good day for fertilizer application. Avoid morning irrigation.",
      "Partly Cloudy": "Moderate farming conditions. Regular monitoring advised.",
      "Cloudy": "Ideal for pest monitoring. High disease risk. Increase ventilation.",
      "Rainy": "Perfect for transplanting. Water plants naturally. No spraying.",
      "Heavy Rain": "Heavy rain expected. Avoid field work. Check crop drainage.",
    };

    return {
      day: dayNames[i],
      date: generateForecastDate(i + 1),
      temp: weather.temp + "°C",
      condition: weather.condition,
      rainfall: weather.rainfall + " mm",
      humidity: weather.humidity + "%",
      windSpeed: weather.windSpeed + " km/h",
      icon: weather.icon,
      advice: adviceMap[weather.condition] || "Monitor crop conditions.",
    };
  });

  const tips = [
    {
      icon: "💧",
      title: "Irrigation Timing",
      description: "Water early morning (5-7 AM) or late evening (6-8 PM) to minimize evaporation.",
    },
    {
      icon: "🌱",
      title: "Monsoon Prep",
      description:
        "Ensure proper drainage before heavy rains. Use raised beds for waterlogged areas.",
    },
    {
      icon: "🐛",
      title: "Disease Alert",
      description:
        "High humidity forecast? Check for fungal diseases. Increase air circulation.",
    },
    {
      icon: "☀️",
      title: "Sunny Day Tasks",
      description:
        "Harvest crops, dry produce, apply treatments. Avoid during peak heat (12-3 PM).",
    },
  ];

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
              mb: 3,
              fontSize: { xs: "28px", sm: "32px", md: "36px" },
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Weather Forecast & Farm Advice
          </Typography>
          
          {/* Location Selectors */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#2d5016", mb: 0.8 }}>
                  Select State
                </Typography>
                <Select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    const districts = getDistrictsForState(e.target.value);
                    setSelectedDistrict(districts[0].toLowerCase().replace(/\s+/g, "-"));
                  }}
                  sx={{
                    background: "#fff",
                    borderRadius: "8px",
                    border: "2px solid #4caf50",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    fontWeight: 600,
                    color: "#2d5016",
                  }}
                >
                  {Object.entries(stateDistrictMap).map(([key, state]) => (
                    <MenuItem key={key} value={key}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#2d5016", mb: 0.8 }}>
                  Select District
                </Typography>
                <Select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  sx={{
                    background: "#fff",
                    borderRadius: "8px",
                    border: "2px solid #4caf50",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    fontWeight: 600,
                    color: "#2d5016",
                  }}
                >
                  {getDistrictsForState(selectedState).map((district) => (
                    <MenuItem key={district} value={district.toLowerCase().replace(/\s+/g, "-")}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Typography
            sx={{
              color: "#3d7e21",
              fontSize: { xs: "14px", sm: "15px" },
              fontWeight: 600,
            }}
          >
            {weatherData?.region || `${selectedDistrict}, ${stateDistrictMap[selectedState]?.name}`}
          </Typography>
        </Box>

        {/* Current Weather */}
        <Card
          sx={{
            mb: 4,
            borderRadius: "16px",
            border: "3px solid #2196f3",
            boxShadow: "0 8px 24px rgba(33, 150, 243, 0.2)",
            background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "48px", md: "64px" },
                      fontWeight: 900,
                      color: "#2196f3",
                      lineHeight: 1,
                    }}
                  >
                    {currentWeather.temp}°C
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "16px", md: "18px" },
                      fontWeight: 700,
                      color: "#2d5016",
                      mt: 1,
                    }}
                  >
                    {currentWeather.condition}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Grid container spacing={1.5}>
                  <Grid item xs={6} sm={12}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        p: 1.5,
                        background: "#fff",
                        borderRadius: "12px",
                        border: "2px solid #90caf9",
                      }}
                    >
                      <WaterDropIcon sx={{ color: "#2196f3", fontSize: "24px" }} />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "#888",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          Humidity
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 900,
                            color: "#2d5016",
                          }}
                        >
                          {currentWeather.humidity}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={12}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        p: 1.5,
                        background: "#fff",
                        borderRadius: "12px",
                        border: "2px solid #90caf9",
                      }}
                    >
                      <OpacityIcon sx={{ color: "#2196f3", fontSize: "24px" }} />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "#888",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          Rainfall
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 900,
                            color: "#2d5016",
                          }}
                        >
                          {currentWeather.rainfall} mm
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={12}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        p: 1.5,
                        background: "#fff",
                        borderRadius: "12px",
                        border: "2px solid #90caf9",
                      }}
                    >
                      <AirIcon sx={{ color: "#2196f3", fontSize: "24px" }} />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "#888",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          Wind Speed
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 900,
                            color: "#2d5016",
                          }}
                        >
                          {currentWeather.windSpeed} km/h
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={12}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        p: 1.5,
                        background: "#fff",
                        borderRadius: "12px",
                        border: "2px solid #90caf9",
                      }}
                    >
                      <LightbulbIcon sx={{ color: "#ff9800", fontSize: "24px" }} />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "#888",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          UV Index
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 900,
                            color: "#ff9800",
                          }}
                        >
                          {currentWeather.uvIndex} (High)
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 7-Day Forecast */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontWeight: 900,
              color: "#2d5016",
              mb: 2,
              fontSize: { xs: "18px", md: "20px" },
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            7-Day Forecast
          </Typography>

          <Grid container spacing={2}>
            {forecastData.map((day, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3.5} key={idx}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    border: "3px solid #2196f3",
                    background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(33, 150, 243, 0.25)",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                    {/* Day & Date */}
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: "#2d5016",
                        fontSize: { xs: "13px", md: "14px" },
                        mb: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {day.day}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#888",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {day.date}
                    </Typography>

                    {/* Weather Icon & Condition */}
                    <Box sx={{ textAlign: "center", mb: 1.5 }}>
                      <Typography sx={{ fontSize: "32px", mb: 0.5 }}>
                        {day.icon}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#3d7e21",
                        }}
                      >
                        {day.condition}
                      </Typography>
                    </Box>

                    {/* Temperature */}
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: 900,
                        color: "#2196f3",
                        textAlign: "center",
                        mb: 1.5,
                      }}
                    >
                      {day.temp}
                    </Typography>

                    {/* Weather Details */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mb: 1.5 }}>
                      <Box sx={{ display: "flex", gap: 0.8, alignItems: "center" }}>
                        <OpacityIcon sx={{ fontSize: "14px", color: "#2196f3" }} />
                        <Typography sx={{ fontSize: "11px", color: "#666", fontWeight: 600 }}>
                          {day.rainfall}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.8, alignItems: "center" }}>
                        <WaterDropIcon sx={{ fontSize: "14px", color: "#2196f3" }} />
                        <Typography sx={{ fontSize: "11px", color: "#666", fontWeight: 600 }}>
                          {day.humidity}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.8, alignItems: "center" }}>
                        <AirIcon sx={{ fontSize: "14px", color: "#2196f3" }} />
                        <Typography sx={{ fontSize: "11px", color: "#666", fontWeight: 600 }}>
                          {day.windSpeed}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Farm Advice */}
                    <Box
                      sx={{
                        p: 1,
                        background: "#f5f9f0",
                        borderRadius: "8px",
                        border: "1px solid #7cb342",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#2d5016",
                          fontWeight: 600,
                          lineHeight: 1.4,
                        }}
                      >
                        💡 {day.advice}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Farming Tips */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontWeight: 900,
              color: "#2d5016",
              mb: 2,
              fontSize: { xs: "18px", md: "20px" },
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            Smart Farming Tips Based on Weather
          </Typography>

          <Grid container spacing={2}>
            {tips.map((tip, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    border: "3px solid #7cb342",
                    background: "linear-gradient(135deg, #f5f9f0 0%, #ffffff 100%)",
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <Typography sx={{ fontSize: "28px" }}>{tip.icon}</Typography>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 900,
                            color: "#2d5016",
                            fontSize: { xs: "14px", md: "15px" },
                            mb: 0.5,
                          }}
                        >
                          {tip.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "13px", md: "14px" },
                            color: "#555",
                            fontWeight: 500,
                            lineHeight: 1.5,
                          }}
                        >
                          {tip.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default WeatherNew;
