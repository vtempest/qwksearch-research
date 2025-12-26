"use client";

import { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";

interface AuthContextType {
  session: any; // TODO: Add proper session type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a fallback for when used outside provider
    return { session: null };
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use better-auth's session hook
  const session = authClient.useSession();

  return (
    <AuthContext.Provider value={{ session: session.data }}>
      {children}
    </AuthContext.Provider>
  );
}
