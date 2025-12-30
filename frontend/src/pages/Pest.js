import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BugReportIcon from "@mui/icons-material/BugReport";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import { getTranslation } from "../i18n";

function Pest({ lang = "en" }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Mock AI detection results for demo
  const mockDetectionResults = [
    {
      disease: "Leaf Rust",
      confidence: 94,
      severity: "High",
      treatment: "Spray with copper-based fungicide every 10 days. Remove infected leaves.",
      prevention: "Ensure proper spacing for air circulation and avoid overhead irrigation.",
    },
    {
      disease: "Powdery Mildew",
      confidence: 87,
      severity: "Medium",
      treatment: "Use sulfur dust or neem oil spray at 2-3% concentration.",
      prevention: "Maintain proper humidity and provide good air ventilation.",
    },
    {
      disease: "Healthy Plant",
      confidence: 98,
      severity: "None",
      treatment: "No treatment needed. Continue regular care.",
      prevention: "Maintain proper watering, fertilizing, and pest monitoring.",
    },
  ];

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setAnalyzing(true);
    setError(null);

    // Simulate API call with delay
    setTimeout(() => {
      // Mock: Random detection result
      const randomResult = mockDetectionResults[Math.floor(Math.random() * mockDetectionResults.length)];
      setResult(randomResult);
      setAnalyzing(false);
    }, 2000);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "#d32f2f";
      case "Medium":
        return "#f57c00";
      case "Low":
        return "#fbc02d";
      default:
        return "#4caf50";
    }
  };

  const getSeverityIcon = (severity) => {
    if (severity === "None") return <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 40, mr: 1 }} />;
    return <WarningIcon sx={{ color: getSeverityColor(severity), fontSize: 40, mr: 1 }} />;
  };

  return (
    <Box sx={{ background: "linear-gradient(135deg, #f5f9f0 0%, #ffffff 100%)", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <BugReportIcon sx={{ fontSize: 48, color: "#ff9800", mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: "#2d5016" }}>
            {getTranslation(lang, "pestDetection")}
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", maxWidth: 600, mx: "auto" }}>
            Upload a crop image to detect diseases, pests, and get treatment recommendations.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {/* Upload Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", borderRadius: "12px", border: "1px solid #c8e6c9" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#2d5016" }}>
                  {getTranslation(lang, "selectImage")}
                </Typography>

                <Box
                  sx={{
                    border: "2px dashed #7cb342",
                    borderRadius: "8px",
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "rgba(124, 179, 66, 0.05)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    mb: 3,
                    position: "relative",
                    "&:hover": {
                      backgroundColor: "rgba(124, 179, 66, 0.1)",
                      borderColor: "#558b2f",
                    },
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={analyzing}
                  />
                  <CloudUploadIcon sx={{ fontSize: 48, color: "#7cb342", mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    {getTranslation(lang, "selectImageDesc")}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    or drag and drop
                  </Typography>
                </Box>

                {/* Selected File Info */}
                {selectedImage && (
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label={selectedImage.name}
                      onDelete={handleClear}
                      sx={{
                        backgroundColor: "#c8e6c9",
                        color: "#2d5016",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                )}

                {/* Error Message */}
                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: "8px" }}>
                    {error}
                  </Alert>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleDetect}
                    disabled={!selectedImage || analyzing}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {analyzing ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        {getTranslation(lang, "analyzing")}
                      </>
                    ) : (
                      getTranslation(lang, "detect")
                    )}
                  </Button>
                  {selectedImage && (
                    <Button variant="outlined" onClick={handleClear} disabled={analyzing}>
                      {getTranslation(lang, "close")}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Preview Section */}
          <Grid item xs={12} md={6}>
            {preview && (
              <Card sx={{ height: "100%", borderRadius: "12px", border: "1px solid #c8e6c9", overflow: "hidden" }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "auto",
                    maxHeight: 400,
                    overflow: "hidden",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <img
                    src={preview}
                    alt="Crop preview"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Card>
            )}

            {!preview && (
              <Card sx={{ height: "100%", borderRadius: "12px", border: "1px solid #c8e6c9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <BugReportIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
                  <Typography variant="body2" sx={{ color: "#999" }}>
                    Image preview will appear here
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Detection Results */}
        {result && (
          <Box sx={{ mb: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: "#2d5016" }}>
              {result.severity === "None"
                ? getTranslation(lang, "noResults")
                : `${getTranslation(lang, "diseaseDetected")}: ${result.disease}`}
            </Typography>

            <Grid container spacing={4}>
              {/* Main Result Card */}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    borderRadius: "12px",
                    border: `2px solid ${getSeverityColor(result.severity)}`,
                    background: `linear-gradient(135deg, ${getSeverityColor(result.severity)}15 0%, ${getSeverityColor(result.severity)}05 100%)`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      {getSeverityIcon(result.severity)}
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "#2d5016" }}>
                          {result.disease}
                        </Typography>
                        {result.severity !== "None" && (
                          <Chip
                            label={`Severity: ${result.severity}`}
                            size="small"
                            sx={{
                              backgroundColor: getSeverityColor(result.severity),
                              color: "#fff",
                              fontWeight: 600,
                              mt: 1,
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Confidence Meter */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {getTranslation(lang, "confidence")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#2d5016" }}>
                          {result.confidence}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={result.confidence}
                        sx={{
                          height: 8,
                          borderRadius: "4px",
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            background: `linear-gradient(90deg, #4caf50 0%, #7cb342 100%)`,
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Treatment Card */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: "12px", border: "1px solid #c8e6c9" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: "#2d5016",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <CheckCircleIcon sx={{ color: "#4caf50" }} />
                      {getTranslation(lang, "treatment")}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 3 }}>
                      {result.treatment}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: "#2d5016",
                      }}
                    >
                      Prevention
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8 }}>
                      {result.prevention}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Expert Tips */}
            <Paper
              sx={{
                mt: 4,
                p: 4,
                background: "linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)",
                borderLeft: "4px solid #ff9800",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#e65100" }}>
                💡 Expert Tips
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8 }}>
                <strong>Timing:</strong> Start treatment immediately after detection to prevent spread. <br />
                <strong>Application:</strong> Apply treatments in early morning or late evening for better effectiveness. <br />
                <strong>Repeat:</strong> Follow the recommended frequency strictly for complete eradication.
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Information Section */}
        {!result && (
          <Box sx={{ pt: 4, borderTop: "2px solid #c8e6c9" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#2d5016" }}>
                  How It Works
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                  <strong>1. Upload Image:</strong> Take a clear photo of the affected crop leaf or plant part.
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                  <strong>2. AI Analysis:</strong> Our AI model analyzes the image for common diseases and pests.
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                  <strong>3. Get Results:</strong> Receive instant diagnosis with treatment recommendations.
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
                  <strong>4. Take Action:</strong> Follow treatment steps to protect your crop.
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                    p: 4,
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Best Practices
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                    ✓ Use clear, well-lit photos
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                    ✓ Capture multiple angles of the problem
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                    ✓ Include scale reference in photo
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95 }}>
                    ✓ Consult local experts for confirmation
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Pest;
