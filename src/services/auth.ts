import axios from "./axios";

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

interface RegisterResponse {
  message: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  userId?: number;
  message: string;
  email?: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>("/register", data);
  return response.data;
};

/**
 * Login a user
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>("/login", data);
  return response.data;
};
