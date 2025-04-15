import { UserType } from "@/lib/models/User";
import { apiRoutes } from "../constants/api-routes";

const register = async (userData: UserType) => {
  const response = await fetch(apiRoutes.register(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const result = await response.json();
  return result;
};

const login = async (userCredentials: Omit<UserType, "name">) => {
  const response = await fetch(apiRoutes.login(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userCredentials),
  });
  const result = await response.json();
  return result;
};

interface UserToken {
  email: string;
  exp: number;
  iat: number;
  id: string;
  name: string;
}

const getUserFromToken = async (): Promise<UserToken> => {
  const response = await fetch(apiRoutes.me());
  const result = await response.json();
  return result;
};

const logout = async () => {
  const response = await fetch(apiRoutes.logout(), {
    method: "POST",
  });
  const result = await response.json();
  return result;
};

export const AuthService = {
  register,
  login,
  getUserFromToken,
  logout,
};
