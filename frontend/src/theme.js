import { createTheme } from "@mui/material/styles";

// Agriculture-friendly color palette
const agriGreen = "#2d5016"; // Dark forest green
const lightGreen = "#3d7e21"; // Vibrant agriculture green
const accentGreen = "#7cb342"; // Lighter accent green
const lightBg = "#f5f9f0"; // Very light green background
const darkText = "#1a3a0d";

export const theme = createTheme({
  palette: {
    primary: {
      main: agriGreen,
      light: lightGreen,
      dark: "#1e3a0f",
      contrastText: "#fff",
    },
    secondary: {
      main: accentGreen,
      light: "#9ccc65",
      dark: "#558b2f",
      contrastText: "#fff",
    },
    success: {
      main: "#43a047",
      light: "#66bb6a",
      dark: "#2e7d32",
    },
    warning: {
      main: "#f57c00",
      light: "#ff9800",
      dark: "#e65100",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
    },
    background: {
      default: "#ffffff",
      paper: lightBg,
    },
    text: {
      primary: darkText,
      secondary: "#558b2f",
    },
    divider: "#c8e6c9",
  },

  typography: {
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: agriGreen,
      marginBottom: "1rem",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      color: agriGreen,
      marginBottom: "1rem",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: agriGreen,
      marginBottom: "0.8rem",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: darkText,
    },
    h5: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: darkText,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      color: darkText,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: darkText,
    },
    body2: {
      fontSize: "0.95rem",
      lineHeight: 1.5,
      color: "#555",
    },
    button: {
      textTransform: "capitalize",
      fontWeight: 600,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "capitalize",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${agriGreen} 0%, ${lightGreen} 100%)`,
          color: "#fff",
          "&:hover": {
            background: `linear-gradient(135deg, ${lightGreen} 0%, ${accentGreen} 100%)`,
          },
        },
        outlined: {
          borderColor: agriGreen,
          color: agriGreen,
          "&:hover": {
            backgroundColor: "rgba(45, 80, 22, 0.05)",
            borderColor: lightGreen,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          border: "1px solid rgba(45, 80, 22, 0.1)",
          "&:hover": {
            boxShadow: "0 12px 32px rgba(45, 80, 22, 0.15)",
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "&:hover fieldset": {
              borderColor: lightGreen,
            },
            "&.Mui-focused fieldset": {
              borderColor: agriGreen,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
        elevation1: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          fontWeight: 500,
        },
        filled: {
          backgroundColor: "rgba(45, 80, 22, 0.1)",
          color: agriGreen,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: agriGreen,
        },
      },
    },
  },

  shape: {
    borderRadius: 8,
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
