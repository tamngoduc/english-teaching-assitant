import { Box, Skeleton } from "@mui/material";

import { useTheme } from "src/hooks/useTheme";

export const LoadingScreen = () => {
  const { isDarkMode } = useTheme();
  return (
    <Box sx={{ maxWidth: 768, mx: "auto", p: 3 }}>
      {/* AI Message Skeleton */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 3,
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Skeleton
          variant="rounded"
          width={36}
          height={36}
          sx={{
            bgcolor: isDarkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(79, 70, 229, 0.1)",
            borderRadius: 2,
          }}
        />
        <Box sx={{ maxWidth: "75%", width: "100%" }}>
          <Skeleton
            variant="rounded"
            height={100}
            sx={{
              bgcolor: isDarkMode ? "rgba(30, 41, 59, 0.7)" : "rgba(248, 250, 252, 0.7)",
              borderRadius: 3,
              mb: 1,
            }}
          />
          <Skeleton
            variant="text"
            width={60}
            sx={{
              bgcolor: isDarkMode
                ? "rgba(148, 163, 184, 0.2)"
                : "rgba(100, 116, 139, 0.2)",
            }}
          />
        </Box>
      </Box>

      {/* User Message Skeleton */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 3,
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box sx={{ maxWidth: "75%", width: "60%" }}>
          <Skeleton
            variant="rounded"
            height={60}
            sx={{
              bgcolor: isDarkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.2)",
              borderRadius: 3,
              mb: 1,
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Skeleton
              variant="text"
              width={60}
              sx={{
                bgcolor: isDarkMode
                  ? "rgba(148, 163, 184, 0.2)"
                  : "rgba(100, 116, 139, 0.2)",
              }}
            />
          </Box>
        </Box>
        <Skeleton
          variant="rounded"
          width={36}
          height={36}
          sx={{
            bgcolor: isDarkMode ? "rgba(55, 65, 81, 0.7)" : "rgba(229, 231, 235, 0.7)",
            borderRadius: 2,
          }}
        />
      </Box>

      {/* AI Message Skeleton (shorter) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 3,
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Skeleton
          variant="rounded"
          width={36}
          height={36}
          sx={{
            bgcolor: isDarkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(79, 70, 229, 0.1)",
            borderRadius: 2,
          }}
        />
        <Box sx={{ maxWidth: "75%", width: "100%" }}>
          <Skeleton
            variant="rounded"
            height={120}
            sx={{
              bgcolor: isDarkMode ? "rgba(30, 41, 59, 0.7)" : "rgba(248, 250, 252, 0.7)",
              borderRadius: 3,
              mb: 1,
            }}
          />
          <Skeleton
            variant="text"
            width={60}
            sx={{
              bgcolor: isDarkMode
                ? "rgba(148, 163, 184, 0.2)"
                : "rgba(100, 116, 139, 0.2)",
            }}
          />
        </Box>
      </Box>

      {/* Loading animation at the bottom */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          mt: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 0.8,
          }}
        >
          {[0, 1, 2].map(i => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: isDarkMode ? "primary.main" : "primary.main",
                opacity: 0.7,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
                "@keyframes pulse": {
                  "0%, 80%, 100%": {
                    transform: "scale(0.8)",
                    opacity: 0.4,
                  },
                  "40%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
