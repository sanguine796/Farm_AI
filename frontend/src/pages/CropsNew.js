import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import EventIcon from "@mui/icons-material/Event";
import TimelineIcon from "@mui/icons-material/Timeline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WaterIcon from "@mui/icons-material/Water";
import { useLanguage } from "../LanguageContext";
import { getTranslation } from "../i18n";
import API from "../services/api";

const CropsNew = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    soilType: "black",
    farmSize: "",
    region: "kerala",
    district: "Kottayam",
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const soilTypes = [
    { value: "alluvial", label: "Alluvial (Fertile plains)" },
    { value: "black", label: "Black Soil (Deccan)" },
    { value: "red", label: "Red Soil (Southern regions)" },
    { value: "laterite", label: "Laterite (Coastal areas)" },
    { value: "desert", label: "Desert (Arid regions)" },
    { value: "mountain", label: "Mountain (Hilly regions)" },
    { value: "clay", label: "Clay (Heavy soil)" },
    { value: "sandy", label: "Sandy (Light soil)" },
    { value: "loamy", label: "Loamy (Mixed soil)" },
    { value: "coastal", label: "Coastal (Salt-resistant)" },
  ];

  // Pan-India State and District mapping
  const stateDistrictMap = {
    "andhra-pradesh": {
      name: "Andhra Pradesh",
      districts: [
        "Nellore",
        "Chittoor",
        "Anantapur",
        "Kadapa",
        "Kurnool",
        "Prakasam",
      ],
    },
    maharashtra: {
      name: "Maharashtra",
      districts: [
        "Nagpur",
        "Wardha",
        "Aurangabad",
        "Ahmednagar",
        "Solapur",
        "Kolhapur",
      ],
    },
    karnataka: {
      name: "Karnataka",
      districts: [
        "Tumkur",
        "Kolar",
        "Hassan",
        "Belgaum",
        "Hubbali",
        "Mangalore",
      ],
    },
    tamil_nadu: {
      name: "Tamil Nadu",
      districts: [
        "Madurai",
        "Coimbatore",
        "Salem",
        "Trichy",
        "Tirunelveli",
        "Kanniyakumari",
      ],
    },
    kerala: {
      name: "Kerala",
      districts: [
        "Kottayam",
        "Alappuzha",
        "Palakkad",
        "Idukki",
        "Wayanad",
        "Ernakulam",
      ],
    },
    punjab: {
      name: "Punjab",
      districts: [
        "Ludhiana",
        "Amritsar",
        "Patiala",
        "Jalandhar",
        "Hoshiarpur",
        "Muktsar",
      ],
    },
    haryana: {
      name: "Haryana",
      districts: [
        "Hisar",
        "Bhiwani",
        "Kurukshetra",
        "Fatehabad",
        "Sirsa",
        "Yamunanagar",
      ],
    },
    uttar_pradesh: {
      name: "Uttar Pradesh",
      districts: [
        "Meerut",
        "Varanasi",
        "Lucknow",
        "Agra",
        "Kanpur",
        "Mathura",
      ],
    },
    madhya_pradesh: {
      name: "Madhya Pradesh",
      districts: [
        "Indore",
        "Bhopal",
        "Chhindwara",
        "Jabalpur",
        "Sagar",
        "Gwalior",
      ],
    },
    rajasthan: {
      name: "Rajasthan",
      districts: [
        "Jaipur",
        "Jodhpur",
        "Bikaner",
        "Udaipur",
        "Ajmer",
        "Banswara",
      ],
    },
    gujarati: {
      name: "Gujarat",
      districts: [
        "Ahmedabad",
        "Vadodara",
        "Surat",
        "Bharuch",
        "Rajkot",
        "Junagadh",
      ],
    },
    telangana: {
      name: "Telangana",
      districts: [
        "Hyderabad",
        "Warangal",
        "Ranga Reddy",
        "Medak",
        "Nalgonda",
        "Karimnagar",
      ],
    },
  };

  // Regions for backward compatibility (will use state as display)
  const regions = [
    { value: "andhra-pradesh", label: "Andhra Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "karnataka", label: "Karnataka" },
    { value: "tamil_nadu", label: "Tamil Nadu" },
    { value: "kerala", label: "Kerala" },
    { value: "punjab", label: "Punjab" },
    { value: "haryana", label: "Haryana" },
    { value: "uttar_pradesh", label: "Uttar Pradesh" },
    { value: "madhya_pradesh", label: "Madhya Pradesh" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "gujarati", label: "Gujarat" },
    { value: "telangana", label: "Telangana" },
  ];

  const cropDatabase = {
    black: {
      rice: {
        name: "Rice (Jyothi)",
        season: "Kharif",
        duration: "120 days",
        yield: "4-5 tons/acre",
        water: "High",
      },
      cotton: {
        name: "Cotton",
        season: "Kharif",
        duration: "210 days",
        yield: "12-15 bales/acre",
        water: "Medium",
      },
      soybean: {
        name: "Soybean",
        season: "Kharif",
        duration: "100-110 days",
        yield: "10-12 quintals/acre",
        water: "Medium",
      },
    },
    red: {
      groundnut: {
        name: "Groundnut",
        season: "Kharif",
        duration: "130 days",
        yield: "8-10 bags/acre",
        water: "Medium",
      },
      castor: {
        name: "Castor",
        season: "Year-round",
        duration: "210 days",
        yield: "5-6 tons/acre",
        water: "Low",
      },
      millets: {
        name: "Millets (Bajra)",
        season: "Kharif",
        duration: "90-120 days",
        yield: "8-10 quintals/acre",
        water: "Low",
      },
    },
    alluvial: {
      wheat: {
        name: "Wheat",
        season: "Rabi",
        duration: "120-140 days",
        yield: "20-25 quintals/acre",
        water: "Medium",
      },
      sugarcane: {
        name: "Sugarcane",
        season: "Year-round",
        duration: "12 months",
        yield: "50-60 tons/acre",
        water: "High",
      },
      maize: {
        name: "Maize (Corn)",
        season: "Kharif",
        duration: "90-100 days",
        yield: "30-35 quintals/acre",
        water: "Medium",
      },
    },
    laterite: {
      coconut: {
        name: "Coconut",
        season: "Year-round",
        duration: "3-4 years",
        yield: "40-60 nuts/year",
        water: "High",
      },
      areca: {
        name: "Areca Nut",
        season: "Year-round",
        duration: "5-6 years",
        yield: "4-5 tons/acre",
        water: "High",
      },
      cardamom: {
        name: "Cardamom",
        season: "Year-round",
        duration: "4-5 years",
        yield: "200-250 kg/acre",
        water: "High",
      },
    },
    desert: {
      bajra: {
        name: "Bajra (Pearl Millet)",
        season: "Kharif",
        duration: "80-90 days",
        yield: "6-8 quintals/acre",
        water: "Very Low",
      },
      gram: {
        name: "Gram (Chickpea)",
        season: "Rabi",
        duration: "90-120 days",
        yield: "8-10 quintals/acre",
        water: "Low",
      },
      cumin: {
        name: "Cumin",
        season: "Rabi",
        duration: "120-150 days",
        yield: "6-8 quintals/acre",
        water: "Low",
      },
    },
    mountain: {
      potato: {
        name: "Potato",
        season: "Kharif/Rabi",
        duration: "90-120 days",
        yield: "15-20 tons/acre",
        water: "Medium",
      },
      apple: {
        name: "Apple",
        season: "Year-round",
        duration: "3-4 years",
        yield: "12-15 tons/acre",
        water: "Medium",
      },
      ginger: {
        name: "Ginger",
        season: "Kharif",
        duration: "240-270 days",
        yield: "10-12 tons/acre",
        water: "High",
      },
    },
    clay: {
      rice: {
        name: "Rice",
        season: "Kharif",
        duration: "120 days",
        yield: "4-5 tons/acre",
        water: "High",
      },
      lentil: {
        name: "Lentil (Masur)",
        season: "Rabi",
        duration: "90-110 days",
        yield: "8-10 quintals/acre",
        water: "Low",
      },
      mustard: {
        name: "Mustard",
        season: "Rabi",
        duration: "100-120 days",
        yield: "10-12 quintals/acre",
        water: "Low",
      },
    },
    sandy: {
      watermelon: {
        name: "Watermelon",
        season: "Summer",
        duration: "90-100 days",
        yield: "10-15 tons/acre",
        water: "Medium",
      },
      peanut: {
        name: "Peanut",
        season: "Kharif",
        duration: "120-150 days",
        yield: "8-10 bags/acre",
        water: "Medium",
      },
      sunflower: {
        name: "Sunflower",
        season: "Rabi/Kharif",
        duration: "100-120 days",
        yield: "10-12 quintals/acre",
        water: "Medium",
      },
    },
    loamy: {
      sugarcane: {
        name: "Sugarcane",
        season: "Year-round",
        duration: "12 months",
        yield: "50-60 tons/acre",
        water: "High",
      },
      onion: {
        name: "Onion",
        season: "Rabi",
        duration: "120-150 days",
        yield: "15-20 tons/acre",
        water: "Medium",
      },
      tobacco: {
        name: "Tobacco",
        season: "Rabi",
        duration: "100-120 days",
        yield: "20-25 quintals/acre",
        water: "Medium",
      },
    },
    coastal: {
      rice: {
        name: "Salt-tolerant Rice",
        season: "Kharif",
        duration: "120 days",
        yield: "3-4 tons/acre",
        water: "High",
      },
      coconut: {
        name: "Coconut",
        season: "Year-round",
        duration: "3-4 years",
        yield: "40-60 nuts/year",
        water: "High",
      },
      cashew: {
        name: "Cashew",
        season: "Year-round",
        duration: "4-5 years",
        yield: "1-2 tons/acre",
        water: "Medium",
      },
    },
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGetRecommendations = async () => {
    if (!formData.farmSize) {
      alert(getTranslation(language, "fillAllFields") || "Please fill in all fields");
      return;
    }

    setLoading(true);
    console.log("[CROPS] Requesting crop recommendations in language:", language);
    console.log("[CROPS] Form data:", {
      soilType: formData.soilType,
      farmSize: formData.farmSize,
      region: formData.region,
      district: formData.district,
      language: language,
    });

    try {
      console.log("[CROPS] Sending request to /api/crops endpoint with language...");
      const response = await API.get("/crops", {
        params: {
          season: formData.season || "kharif",
          region: formData.region,
          language: language,
        },
      });

      console.log("[CROPS] Backend response received:", response.data);

      const recs = (response.data.crops || []).map((crop) => ({
        ...crop,
        id: crop.name.toLowerCase().replace(/\s+/g, "-"),
      }));

      setRecommendations(recs);
      console.log("[CROPS] Recommendations updated in UI:", recs.length, "crops");
      setLoading(false);
    } catch (error) {
      console.error("[CROPS] API Error:", {
        message: error.message,
        endpoint: "/api/crops",
        language: language,
        requestParams: {
          season: formData.season || "kharif",
          region: formData.region,
          language: language,
        },
        errorDetails: error.response?.data || error.message,
      });

      // Fallback to mock data
      console.log("[CROPS] Falling back to mock data...");
      const crops = cropDatabase[formData.soilType] || {};
      const recs = Object.values(crops).map((crop) => ({
        ...crop,
        id: crop.name.toLowerCase().replace(" ", "-"),
      }));
      setRecommendations(recs);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f9f0 0%, #ffffff 100%)",
        minHeight: "calc(100vh - 140px)",
        py: { xs: 3, sm: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <LocalFloristIcon
            sx={{
              fontSize: { xs: 40, sm: 56 },
              color: "#2d5016",
              mb: 2,
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: 28, sm: 40 },
              fontWeight: 900,
              color: "#2d5016",
              mb: 1,
              letterSpacing: 1,
            }}
          >
            Crop Recommendations
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: "#666",
              maxWidth: 500,
              mx: "auto",
            }}
          >
            Get personalized crop recommendations based on your soil type, farm size, and region.
          </Typography>
        </Box>

        {/* Input Form */}
        <Paper
          elevation={2}
          sx={{
            background: "#fff",
            borderRadius: "16px",
            p: { xs: 3, sm: 4 },
            mb: 6,
            border: "2px solid #c8e6c9",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 22 },
              fontWeight: 800,
              mb: 4,
              color: "#2d5016",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Farm Details
          </Typography>

          <Grid container spacing={3}>
            {/* Soil Type */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  mb: 1.5,
                  color: "#2d5016",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                Soil Type
              </Typography>
              <Select
                fullWidth
                value={formData.soilType}
                onChange={(e) => handleInputChange("soilType", e.target.value)}
                sx={{
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#c8e6c9",
                    "&:hover fieldset": {
                      borderColor: "#2d5016",
                    },
                  },
                }}
              >
                {soilTypes.map((soil) => (
                  <MenuItem key={soil.value} value={soil.value}>
                    {soil.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* Farm Size */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  mb: 1.5,
                  color: "#2d5016",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                Farm Size (Acres)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={formData.farmSize}
                onChange={(e) => handleInputChange("farmSize", e.target.value)}
                placeholder="Enter farm size in acres"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    borderColor: "#c8e6c9",
                    "&:hover fieldset": {
                      borderColor: "#2d5016",
                    },
                  },
                }}
              />
            </Grid>

            {/* Region */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  mb: 1.5,
                  color: "#2d5016",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                Region
              </Typography>
              <Select
                fullWidth
                value={formData.region}
                onChange={(e) => handleInputChange("region", e.target.value)}
                sx={{
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#c8e6c9",
                    "&:hover fieldset": {
                      borderColor: "#2d5016",
                    },
                  },
                }}
              >
                {regions.map((reg) => (
                  <MenuItem key={reg.value} value={reg.value}>
                    {reg.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* District Selection */}
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#2d5016",
                  mb: 1.5,
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                District
              </Typography>
              <Select
                fullWidth
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                sx={{
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#c8e6c9",
                    "&:hover fieldset": {
                      borderColor: "#2d5016",
                    },
                  },
                }}
              >
                {stateDistrictMap[formData.region]?.districts.map((dist) => (
                  <MenuItem key={dist} value={dist}>
                    {dist}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleGetRecommendations}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #2d5016 0%, #3d7e21 100%)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              py: 2,
              mt: 4,
              borderRadius: "10px",
              textTransform: "uppercase",
              letterSpacing: 1,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(45,80,22,0.3)",
              },
              "&:disabled": {
                opacity: 0.7,
              },
            }}
          >
            {loading ? getTranslation(language, "analyzing") : getTranslation(language, "getRecommendations")}
          </Button>
        </Paper>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 22, sm: 28 },
                fontWeight: 800,
                color: "#2d5016",
                mb: 4,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {getTranslation(language, "recommendedCrops")}
            </Typography>

            <Grid container spacing={3}>
              {recommendations.map((crop) => (
                <Grid item xs={12} sm={6} md={4} key={crop.id}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      border: "3px solid #4caf50",
                      background: "#fff",
                      transition: "all 0.4s ease",
                      overflow: "hidden",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "linear-gradient(90deg, #4caf50, transparent)",
                      },
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 16px 48px rgba(76,175,80,0.3)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                      {/* Crop Name */}
                      <Typography
                        sx={{
                          fontSize: { xs: 18, sm: 20 },
                          fontWeight: 800,
                          color: "#2d5016",
                          mb: 3,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {crop.name}
                      </Typography>

                      {/* Details Grid */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1.5, background: "#f5f9f0", borderRadius: "8px" }}>
                            <EventIcon
                              sx={{
                                fontSize: 20,
                                color: "#3d7e21",
                                mb: 0.5,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#666",
                                textTransform: "uppercase",
                              }}
                            >
                              Season
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#2d5016",
                                mt: 0.5,
                              }}
                            >
                              {crop.season}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1.5, background: "#f5f9f0", borderRadius: "8px" }}>
                            <TimelineIcon
                              sx={{
                                fontSize: 20,
                                color: "#3d7e21",
                                mb: 0.5,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#666",
                                textTransform: "uppercase",
                              }}
                            >
                              Duration
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#2d5016",
                                mt: 0.5,
                              }}
                            >
                              {crop.duration}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1.5, background: "#f5f9f0", borderRadius: "8px" }}>
                            <TrendingUpIcon
                              sx={{
                                fontSize: 20,
                                color: "#3d7e21",
                                mb: 0.5,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#666",
                                textTransform: "uppercase",
                              }}
                            >
                              Expected Yield
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#2d5016",
                                mt: 0.5,
                              }}
                            >
                              {crop.yield}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1.5, background: "#f5f9f0", borderRadius: "8px" }}>
                            <WaterIcon
                              sx={{
                                fontSize: 20,
                                color: "#3d7e21",
                                mb: 0.5,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#666",
                                textTransform: "uppercase",
                              }}
                            >
                              Water Need
                            </Typography>
                            <Chip
                              label={crop.water}
                              size="small"
                              sx={{
                                mt: 0.5,
                                background:
                                  crop.water === "High"
                                    ? "#bbdefb"
                                    : crop.water === "Medium"
                                    ? "#fff9c4"
                                    : "#c8e6c9",
                                color: "#1a3a0d",
                                fontWeight: 700,
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>

                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          setSelectedCrop(crop);
                          setOpenDialog(true);
                        }}
                        sx={{
                          color: "#2d5016",
                          borderColor: "#4caf50",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          borderRadius: "8px",
                          py: 1.2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "#4caf50",
                            color: "#fff",
                            borderColor: "#4caf50",
                          },
                        }}
                      >
                        {getTranslation(language, "learnMore")}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Crop Details Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(45,80,22,0.2)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #2d5016 0%, #3d7e21 100%)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {selectedCrop?.name}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedCrop && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#2d5016",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      mb: 0.8,
                    }}
                  >
                    📅 {getTranslation(language, "season")}
                  </Typography>
                  <Typography sx={{ color: "#555", fontSize: 14, fontWeight: 600 }}>
                    {selectedCrop.season}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#2d5016",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      mb: 0.8,
                    }}
                  >
                    ⏱️ {getTranslation(language, "duration")}
                  </Typography>
                  <Typography sx={{ color: "#555", fontSize: 14, fontWeight: 600 }}>
                    {selectedCrop.duration}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#2d5016",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      mb: 0.8,
                    }}
                  >
                    📊 {getTranslation(language, "yield")}
                  </Typography>
                  <Typography sx={{ color: "#555", fontSize: 14, fontWeight: 600 }}>
                    {selectedCrop.yield}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#2d5016",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      mb: 0.8,
                    }}
                  >
                    💧 Water Requirement
                  </Typography>
                  <Chip
                    label={selectedCrop.water}
                    sx={{
                      background:
                        selectedCrop.water === "High"
                          ? "#ffcdd2"
                          : selectedCrop.water === "Medium"
                          ? "#fff9c4"
                          : "#c8e6c9",
                      color: "#1a3a0d",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  />
                </Box>

                <Box sx={{ background: "#f5f9f0", p: 2, borderRadius: "12px" }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#2d5016",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      mb: 1,
                    }}
                  >
                    🌱 Farming Tips
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "#555",
                      lineHeight: 1.6,
                      fontWeight: 500,
                    }}
                  >
                    • Ensure proper soil preparation before planting
                    <br />• Maintain optimal moisture levels during growing season
                    <br />• Monitor for pests and diseases regularly
                    <br />• Apply fertilizers as per soil test recommendations
                    <br />• Harvest at peak maturity for best yield
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="contained"
              fullWidth
              sx={{
                background: "linear-gradient(135deg, #2d5016 0%, #3d7e21 100%)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "8px",
                textTransform: "uppercase",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CropsNew;
