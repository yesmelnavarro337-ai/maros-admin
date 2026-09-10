"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout as logoutRequest, type CurrentUser } from "../services/auth.service";

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => {
        // El middleware solo verificó que existiera una cookie al navegar aquí
        // (protección de navegación). Si el backend rechaza el token con 401
        // (expirado, inválido, o revocado), esa es la autoridad real —
        // limpiamos la sesión local y devolvemos al login.
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function logout() {
    await logoutRequest();
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}