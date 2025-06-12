import type React from "react";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useAuthForm } from "src/hooks/useAuthForm";
import { useTheme } from "src/hooks/useTheme";

import type { User } from "../types";

export const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    isRegisterMode,
    isLoading,
    error,
    loginForm,
    registerForm,
    handleLogin,
    handleRegister,
    toggleMode,
    updateLoginForm,
    updateRegisterForm,
  } = useAuthForm({ onLoginSuccess: onLogin });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDarkMode
          ? "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            padding: 6,
            borderRadius: 3,
            backdropFilter: "blur(20px)",
            background: isDarkMode
              ? "rgba(26, 26, 46, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
            border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          }}
        >
          <Stack spacing={4} alignItems="center">
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                background: isDarkMode
                  ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                  : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                S
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="700"
                sx={{
                  background: isDarkMode
                    ? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
                    : "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                SpeakFluent AI
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
                {isRegisterMode
                  ? "Create your account to start learning"
                  : "Master English through AI-powered conversations"}
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={isRegisterMode ? handleRegisterSubmit : handleLoginSubmit}
              sx={{ width: "100%" }}
            >
              <Stack spacing={3}>
                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}{" "}
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={isRegisterMode ? registerForm.username : loginForm.username}
                  onChange={e => {
                    if (isRegisterMode) {
                      updateRegisterForm("username", e.target.value);
                    } else {
                      updateLoginForm("username", e.target.value);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                {isRegisterMode && (
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={registerForm.email}
                    onChange={e => updateRegisterForm("email", e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={isRegisterMode ? registerForm.password : loginForm.password}
                  onChange={e => {
                    if (isRegisterMode) {
                      updateRegisterForm("password", e.target.value);
                    } else {
                      updateLoginForm("password", e.target.value);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "text.secondary" }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                {isRegisterMode && (
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    variant="outlined"
                    value={registerForm.confirmPassword}
                    onChange={e => updateRegisterForm("confirmPassword", e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: "text.secondary" }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1rem",
                    fontWeight: 500,
                    borderRadius: 2,
                    background: isDarkMode
                      ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                      : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    border: "none",
                    boxShadow: isDarkMode
                      ? "0 4px 20px rgba(99, 102, 241, 0.3)"
                      : "0 4px 20px rgba(79, 70, 229, 0.3)",
                    "&:hover": {
                      background: isDarkMode
                        ? "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)"
                        : "linear-gradient(135deg, #3730a3 0%, #6d28d9 100%)",
                      boxShadow: isDarkMode
                        ? "0 6px 25px rgba(99, 102, 241, 0.4)"
                        : "0 6px 25px rgba(79, 70, 229, 0.4)",
                    },
                    "&:disabled": {
                      background: isDarkMode ? "#374151" : "#9ca3af",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isLoading
                    ? "Please wait..."
                    : isRegisterMode
                      ? "Create Account"
                      : "Sign In"}
                </Button>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {isRegisterMode
                      ? "Already have an account?"
                      : "Don't have an account?"}{" "}
                    <Link
                      component="button"
                      type="button"
                      onClick={toggleMode}
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        fontWeight: 500,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {isRegisterMode ? "Sign In" : "Sign Up"}
                    </Link>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
