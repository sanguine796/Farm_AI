import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
} from "@mui/material";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { getTranslation } from "../i18n";

function Navbar({ lang, setLang }) {
  const [langAnchor, setLangAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "ka", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇮🇳" },
  ];

  const navItems = [
    { path: "/", label: getTranslation(lang, "appName"), isHome: true },
    { path: "/crops", label: getTranslation(lang, "navCrops") },
    { path: "/pest", label: getTranslation(lang, "navPest") },
    { path: "/weather", label: getTranslation(lang, "navWeather") },
    { path: "/market", label: getTranslation(lang, "navMarket") },
    { path: "/chat", label: getTranslation(lang, "navChat") },
  ];

  const handleLangClick = (event) => {
    setLangAnchor(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchor(null);
  };

  const handleLangSelect = (langCode) => {
    setLang(langCode);
    handleLangClose();
  };

  const desktopNavbar = (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(135deg, #2d5016 0%, #3d7e21 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo and App Name */}
        <AgricultureIcon sx={{ mr: 2, fontSize: 32, color: "#fff" }} />
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: 0.5,
          }}
          component={Link}
          to="/"
          style={{ textDecoration: "none" }}
        >
          {getTranslation(lang, "appName")}
        </Typography>

        {/* Desktop Navigation Links */}
        <Box sx={{ display: "flex", gap: 1, mr: 3 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={item.path}
              sx={{
                fontSize: "0.95rem",
                fontWeight: 500,
                textTransform: "capitalize",
                px: 2,
                py: 1,
                borderRadius: "4px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Language Selector */}
        <Button
          color="inherit"
          onClick={handleLangClick}
          startIcon={<LanguageIcon />}
          sx={{
            fontSize: "0.9rem",
            fontWeight: 600,
            textTransform: "capitalize",
            px: 2,
            py: 1,
            borderRadius: "4px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
            },
          }}
        >
          {languages.find((l) => l.code === lang)?.name || "English"}
        </Button>

        <Menu
          anchorEl={langAnchor}
          open={Boolean(langAnchor)}
          onClose={handleLangClose}
          PaperProps={{
            sx: {
              borderRadius: "8px",
              minWidth: 200,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          {languages.map((lang_item) => (
            <MenuItem
              key={lang_item.code}
              onClick={() => handleLangSelect(lang_item.code)}
              selected={lang === lang_item.code}
              sx={{
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: "#2d5016",
                  color: "white",
                },
              }}
            >
              <span style={{ marginRight: "8px" }}>{lang_item.flag}</span>
              {lang_item.name}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );

  const mobileNavbar = (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #2d5016 0%, #3d7e21 100%)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          <AgricultureIcon sx={{ mr: 2, fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
            component={Link}
            to="/"
            style={{ textDecoration: "none" }}
          >
            {getTranslation(lang, "appName")}
          </Typography>

          <Button
            color="inherit"
            size="small"
            onClick={handleLangClick}
            startIcon={<LanguageIcon sx={{ fontSize: 20 }} />}
            sx={{ mr: 1 }}
          >
            {languages.find((l) => l.code === lang)?.code.toUpperCase()}
          </Button>

          <IconButton
            color="inherit"
            onClick={() => setMobileMenuOpen(true)}
            size="large"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: "80%",
            maxWidth: 300,
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Menu
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              fullWidth
              component={Link}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                justifyContent: "flex-start",
                textTransform: "capitalize",
                color: "#333",
                fontSize: "1rem",
                fontWeight: 500,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Drawer>

      <Menu
        anchorEl={langAnchor}
        open={Boolean(langAnchor)}
        onClose={handleLangClose}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            minWidth: 180,
          },
        }}
      >
        {languages.map((lang_item) => (
          <MenuItem
            key={lang_item.code}
            onClick={() => handleLangSelect(lang_item.code)}
            selected={lang === lang_item.code}
            sx={{
              py: 1.2,
              "&:hover": {
                backgroundColor: "#2d5016",
                color: "white",
              },
            }}
          >
            <span style={{ marginRight: "8px" }}>{lang_item.flag}</span>
            {lang_item.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  return isMobile ? mobileNavbar : desktopNavbar;
}

export default Navbar;
