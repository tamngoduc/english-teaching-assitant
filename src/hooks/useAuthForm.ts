import { useState } from "react";

import { login, register } from "src/services/auth";
import type { User } from "src/types";

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

interface UseAuthFormOptions {
  onLoginSuccess: (user: User) => void;
  onRegisterSuccess?: (user: User) => void;
}

export const useAuthForm = ({
  onLoginSuccess,
  onRegisterSuccess,
}: UseAuthFormOptions) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const validateLoginForm = (): boolean => {
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setError("Please fill in all fields");
      return false;
    }
    return true;
  };

  const validateRegisterForm = (): boolean => {
    if (
      !registerForm.username.trim() ||
      !registerForm.password.trim() ||
      !registerForm.email.trim()
    ) {
      setError("Please fill in all fields");
      return false;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    if (!validateLoginForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Call the login API
      const response = await login({
        username: loginForm.username,
        password: loginForm.password,
      });

      if (response.success && response.userId) {
        // Create user object based on successful login
        const user: User = {
          user_id: response.userId,
          username: loginForm.username,
          email: response.email || "", // Use email from response if available
          password: "", // Never store password in frontend
          created_at: new Date().toISOString(),
        };
        onLoginSuccess(user);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    setIsLoading(true);

    if (!validateRegisterForm()) {
      setIsLoading(false);
      return;
    }
    try {
      await register({
        username: registerForm.username,
        password: registerForm.password,
        email: registerForm.email,
      });
      // After successful registration, login with the new credentials
      const loginResponse = await login({
        username: registerForm.username,
        password: registerForm.password,
      });

      if (loginResponse.success && loginResponse.userId) {
        const user: User = {
          user_id: loginResponse.userId,
          username: registerForm.username,
          password: "",
          email: registerForm.email,
          created_at: new Date().toISOString(),
        };

        if (onRegisterSuccess) {
          onRegisterSuccess(user);
        } else {
          onLoginSuccess(user);
        }
      } else {
        // Registration succeeded but login failed
        setError("Registration successful. Please log in.");
        setIsRegisterMode(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError("");
    setLoginForm({ username: "", password: "" });
    setRegisterForm({ username: "", password: "", confirmPassword: "", email: "" });
  };

  const updateLoginForm = (field: keyof LoginForm, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  };

  const updateRegisterForm = (field: keyof RegisterForm, value: string) => {
    setRegisterForm(prev => ({ ...prev, [field]: value }));
  };

  return {
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
    clearError: () => setError(""),
  };
};
