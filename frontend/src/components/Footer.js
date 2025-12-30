import React from "react";
import { Typography, Box, Container, Grid, Link as MuiLink, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useLanguage } from "../LanguageContext";
import { getTranslation } from "../i18n";

const Footer = () => {
  const { language } = useLanguage();
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #2d5016 0%, #3d7e21 100%)",
        color: "#fff",
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {getTranslation(language, "appName")}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
              {getTranslation(language, "subtitle")}
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {getTranslation(language, "about")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink href="/" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                {getTranslation(language, "appName")}
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                {getTranslation(language, "contact")}
              </MuiLink>
            </Box>
          </Grid>

          {/* Legal Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink href="#" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                {getTranslation(language, "privacy")}
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                {getTranslation(language, "terms")}
              </MuiLink>
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {getTranslation(language, "followUs")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                color="inherit"
                size="small"
                href="#"
                target="_blank"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                href="#"
                target="_blank"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                href="#"
                target="_blank"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                href="#"
                target="_blank"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)", py: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {getTranslation(language, "copyright")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;