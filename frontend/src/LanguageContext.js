import React, { createContext, useState, useEffect } from "react";

// Create Language Context
export const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState("ml"); // Default: Malayalam

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("farmAiLanguage");
    if (savedLanguage && ["en", "hi", "te", "ml"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Update language and save to localStorage
  const setLanguage = (lang) => {
    if (["en", "hi", "te", "ml"].includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem("farmAiLanguage", lang);
    }
  };

  const value = {
    language,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use Language Context
export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
