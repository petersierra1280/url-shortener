import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
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
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const stored = Cookies.get("token");
    if (stored) {
      setToken(stored);
      setUser(jwtDecode<User>(stored));
    }
  }, []);

  const login = (newToken: string) => {
    Cookies.set("token", newToken);
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
    Cookies.remove("token");
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
    const res = await registerUser(email, password);
    const token = res.token;
    const decoded = jwtDecode<TokenPayload>(token);
    Cookies.set("token", token);
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
