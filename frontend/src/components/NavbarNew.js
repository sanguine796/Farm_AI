import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import CloudIcon from "@mui/icons-material/Cloud";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ChatIcon from "@mui/icons-material/Chat";
import BugReportIcon from "@mui/icons-material/BugReport";
import LanguageIcon from "@mui/icons-material/Language";
import { useLanguage } from "../LanguageContext";

const NavbarNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { language, setLanguage } = useLanguage();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [langAnchor, setLangAnchor] = useState(null);

  const languages = {
    en: "English",
    ml: "മലയാളം",
    hi: "हिंदी",
    te: "తెలుగు",
  };

  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon sx={{ fontSize: 24 }} />, id: "home" },
    { label: "Crops", path: "/crops", icon: <AgricultureIcon sx={{ fontSize: 24 }} />, id: "crops" },
    { label: "Pest", path: "/pest", icon: <BugReportIcon sx={{ fontSize: 24 }} />, id: "pest" },
    { label: "Weather", path: "/weather", icon: <CloudIcon sx={{ fontSize: 24 }} />, id: "weather" },
    { label: "Market", path: "/market", icon: <TrendingUpIcon sx={{ fontSize: 24 }} />, id: "market" },
    { label: "Chat", path: "/chat", icon: <ChatIcon sx={{ fontSize: 24 }} />, id: "chat" },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, #2d5016 0%, #3d7e21 100%)",
          boxShadow: "0 2px 12px rgba(45,80,22,0.2)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 70, px: { xs: 1, sm: 2 } }}>
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              minWidth: 150,
            }}
            onClick={() => navigate("/")}
          >
            <Box
              sx={{
                background: "#fff",
                borderRadius: "12px",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AgricultureIcon sx={{ fontSize: 28, color: "#2d5016" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: 18, sm: 22 },
                  color: "#fff",
                  letterSpacing: 1,
                  lineHeight: 1,
                }}
              >
                FARM AI
              </Typography>
              <Typography
                sx={{
                  fontSize: 10,
                  color: "#c8e6c9",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                SMART FARMING
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {navItems.map((item) => (
                <Box
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.3,
                    p: 1.5,
                    cursor: "pointer",
                    color: isActive(item.path) ? "#ffd700" : "#fff",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: "8px",
                    position: "relative",
                    "&:hover": {
                      color: "#ffd700",
                      background: "rgba(255,255,255,0.1)",
                      transform: "translateY(-2px)",
                    },
                    "&::after": isActive(item.path) && {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "60%",
                      height: 3,
                      background: "#ffd700",
                      borderRadius: "2px",
                    },
                  }}
                >
                  {item.icon}
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Language Selector & Mobile Menu */}
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            {/* Language Button */}
            <IconButton
              onClick={(e) => setLangAnchor(e.currentTarget)}
              sx={{
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.2,
                p: 1.2,
                borderRadius: "8px",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255,255,255,0.1)",
                  color: "#ffd700",
                },
              }}
            >
              <LanguageIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>
                {language.toUpperCase()}
              </Typography>
            </IconButton>

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{
                  color: "#fff",
                  p: 1.2,
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <MenuIcon sx={{ fontSize: 24 }} />
              </IconButton>
            )}
          </Box>

          {/* Language Menu */}
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
            PaperProps={{
              sx: {
                background: "linear-gradient(135deg, #f5f9f0 0%, #ffffff 100%)",
                borderRadius: "12px",
                minWidth: 180,
                boxShadow: "0 8px 32px rgba(45,80,22,0.15)",
                border: "1px solid #c8e6c9",
              },
            }}
          >
            {Object.entries(languages).map(([code, name]) => (
              <MenuItem
                key={code}
                onClick={() => {
                  console.log(`[LANGUAGE] User selected language: ${code} (${name})`);
                  console.log(`[LANGUAGE] Updating language context...`);
                  setLanguage(code);
                  setLangAnchor(null);
                  console.log(`[LANGUAGE] Language changed to: ${code}`);
                }}
                selected={language === code}
                sx={{
                  fontWeight: language === code ? 700 : 500,
                  color: language === code ? "#2d5016" : "#333",
                  background: language === code ? "rgba(45,80,22,0.08)" : "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: language === code ? "rgba(45,80,22,0.12)" : "#c8e6c9",
                  },
                  py: 1.2,
                  px: 2,
                  borderRadius: "6px",
                  m: 0.5,
                }}
              >
                {name}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #f5f9f0 0%, #ffffff 100%)",
            borderRadius: "20px 20px 0 0",
            maxHeight: "80vh",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 16,
              mb: 3,
              color: "#2d5016",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Menu
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                selected={isActive(item.path)}
                sx={{
                  mb: 1.5,
                  borderRadius: "12px",
                  background: isActive(item.path)
                    ? "linear-gradient(135deg, rgba(45,80,22,0.1) 0%, rgba(61,126,33,0.05) 100%)"
                    : "transparent",
                  color: isActive(item.path) ? "#2d5016" : "#333",
                  fontWeight: isActive(item.path) ? 700 : 600,
                  border: isActive(item.path) ? "2px solid #c8e6c9" : "1px solid transparent",
                  transition: "all 0.3s ease",
                  p: 2,
                  "&:hover": {
                    background: "rgba(45,80,22,0.05)",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? "#2d5016" : "#666",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: "inherit",
                      fontSize: 15,
                      letterSpacing: 0.3,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavbarNew;
