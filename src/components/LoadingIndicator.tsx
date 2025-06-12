import { Box, Typography } from "@mui/material";

import { useTheme } from "src/hooks/useTheme";

export const LoadingIndicator = () => {
  const { isDarkMode } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 3,
        justifyContent: "flex-start",
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          background: isDarkMode
            ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
            : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Typography variant="body2" sx={{ color: "white", fontWeight: 700 }}>
          AI
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: isDarkMode ? "#1e293b" : "#f8fafc",
          borderRadius: 3,
          p: 2.5,
          border: 1,
          borderColor: isDarkMode ? "#334155" : "#e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {[0, 1, 2].map(i => (
            <Box
              key={i}
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: isDarkMode ? "#64748b" : "#94a3b8",
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
                "@keyframes pulse": {
                  "0%, 80%, 100%": {
                    opacity: 0.3,
                  },
                  "40%": {
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
          AI is thinking...
        </Typography>
      </Box>
    </Box>
  );
};
