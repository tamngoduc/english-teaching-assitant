import { createTheme } from "@mui/material/styles";

export const createAppTheme = (isDarkMode: boolean) => {
  return createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "#6366f1" : "#4f46e5",
        light: isDarkMode ? "#818cf8" : "#6366f1",
        dark: isDarkMode ? "#4338ca" : "#3730a3",
      },
      secondary: {
        main: isDarkMode ? "#f59e0b" : "#f59e0b",
      },
      background: {
        default: isDarkMode ? "#0f0f23" : "#fafafa",
        paper: isDarkMode ? "#1a1a2e" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#f8fafc" : "#1e293b",
        secondary: isDarkMode ? "#94a3b8" : "#64748b",
      },
      divider: isDarkMode ? "#334155" : "#e2e8f0",
    },
    typography: {
      fontFamily:
        '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 700, letterSpacing: "-0.025em" },
      h2: { fontWeight: 600, letterSpacing: "-0.025em" },
      h3: { fontWeight: 600, letterSpacing: "-0.025em" },
      h4: { fontWeight: 600, letterSpacing: "-0.025em" },
      h5: { fontWeight: 600, letterSpacing: "-0.025em" },
      h6: { fontWeight: 600, letterSpacing: "-0.025em" },
      body1: { fontWeight: 400, lineHeight: 1.6 },
      body2: { fontWeight: 400, lineHeight: 1.5 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 8,
            padding: "8px 16px",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });
};
