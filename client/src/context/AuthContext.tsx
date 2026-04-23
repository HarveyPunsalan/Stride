import type { User } from "../types/index";
import { useState, useEffect} from "react";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const savedToken = localStorage.getItem("token");
    const activeToken = urlToken || savedToken;

    if (activeToken) {
      localStorage.setItem("token", activeToken);
      window.history.replaceState({}, "", "/");
      fetch(import.meta.env.VITE_API_URL + "/auth/me", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setToken(activeToken);
        })
        .finally(() => setIsLoading(false));
    } else {
      setTimeout(() => setIsLoading(false), 0);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

