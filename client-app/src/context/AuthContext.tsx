import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { register as registerUser } from "../services/auth.service";

type User = {
  id: string;
  email: string;
};

interface TokenPayload {
  sub: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  register: (credentials: { email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode<TokenPayload>(storedToken);

        if (!decoded.sub || !decoded.email) {
          throw new Error("Missing required payload");
        }

        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        logout();
      }
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const decoded = jwtDecode<TokenPayload>(newToken);
    const user: User = {
      id: decoded.sub,
      email: decoded.email,
    };

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const register = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const token = await registerUser(email, password);
    const decoded = jwtDecode<TokenPayload>(token);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({ id: decoded.sub, email: decoded.email })
    );
    setUser({ id: decoded.sub, email: decoded.email });
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
