import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "./theme";
import { LanguageProvider } from "./LanguageContext";
import NavbarNew from "./components/NavbarNew";
import Footer from "./components/Footer";

import HomeNew from "./pages/HomeNew";
import CropsNew from "./pages/CropsNew";
import PestNew from "./pages/PestNew";
import WeatherNew from "./pages/WeatherNew";
import MarketNew from "./pages/MarketNew";
import ChatNew from "./pages/ChatNewFixed";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <Router>
          <NavbarNew />
          <Routes>
            <Route path="/" element={<HomeNew />} />
            <Route path="/crops" element={<CropsNew />} />
            <Route path="/pest" element={<PestNew />} />
            <Route path="/weather" element={<WeatherNew />} />
            <Route path="/market" element={<MarketNew />} />
            <Route path="/chat" element={<ChatNew />} />
          </Routes>
          <Footer />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
