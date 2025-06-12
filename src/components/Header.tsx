import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  AppBar,
  Box,
  Icon,
  IconButton,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useAudioAutoPlay } from "src/hooks/useAudio";
import { useTheme } from "src/hooks/useTheme";

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { autoPlayTTS, handleAutoPlayToggle } = useAudioAutoPlay();
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        height: 56,
      }}
    >
      <Toolbar sx={{ minHeight: "56px !important", px: 3 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            display: { md: "none" },
            color: "text.primary",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              background: isDarkMode
                ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "white", fontWeight: 700 }}>
              S
            </Typography>
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            SpeakFluent AI
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={() => handleAutoPlayToggle(!autoPlayTTS)}>
            {autoPlayTTS ? (
              <RepeatOnIcon sx={{ color: "text.secondary" }} />
            ) : (
              <RepeatIcon sx={{ color: "text.secondary" }} />
            )}
          </IconButton>

          <IconButton onClick={toggleTheme} sx={{ color: "text.primary" }}>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
