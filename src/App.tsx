import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ChatInterface } from "./components/ChatInterface";
import { HomeScreen } from "./components/HomeScreen";
import { LoginPage } from "./components/LoginPage";
import { MainLayout } from "./components/MainLayout";
import { AudioAutoPlayProvider } from "./contexts/AudioAutoPlayContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeContext } from "./contexts/ThemeContext";
import { useAuth } from "./hooks/useAuth";
import { usePersistedTheme } from "./hooks/useTheme";
import { createAppTheme } from "./theme";

// Loading component
const LoadingScreen = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: isDarkMode
        ? "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)"
        : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
    }}
  >
    <CircularProgress color="primary" size={40} />
  </Box>
);

// Main App content component (needs to be inside AuthProvider)
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();
  const theme = usePersistedTheme();

  const appTheme = createAppTheme(theme.isDarkMode);

  // Load saved state on initial render
  useEffect(() => {
    const loadSavedState = () => {
      auth.loadAuthState();
      theme.loadThemeState();
      setIsLoading(false);
    };

    // Small timeout to ensure smooth loading without flash
    const timer = setTimeout(loadSavedState, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <LoadingScreen isDarkMode={theme.isDarkMode} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode: theme.isDarkMode,
        toggleTheme: theme.toggleTheme,
      }}
    >
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <AudioAutoPlayProvider>
          <Box sx={{ height: "100vh", overflow: "hidden" }}>
            {!auth.isAuthenticated ? (
              <LoginPage onLogin={auth.login} />
            ) : (
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomeScreen />} />
                    <Route path="/new" element={<HomeScreen />} />
                    <Route path="/chat/:conversationId" element={<ChatInterface />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            )}
          </Box>
        </AudioAutoPlayProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Main App component
export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};
