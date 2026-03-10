"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUserDataSync } from "@/hooks/useUserDataSync";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || !user || typeof window === "undefined") return;
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const isStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches || nav.standalone;
    if (!isStandalone) return;
    const flagKey = "gymapp-standalone-logout";
    if (window.localStorage.getItem(flagKey)) return;
    window.localStorage.setItem(flagKey, "1");
    signOut(auth).finally(() => setUser(null));
  }, [loading, user]);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      <UserDataSyncWrapper>
        {children}
      </UserDataSyncWrapper>
    </AuthContext.Provider>
  );
}

function UserDataSyncWrapper({ children }: { children: React.ReactNode }) {
  useUserDataSync();
  return <>{children}</>;
}
