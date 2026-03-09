"use client";

import { useEffect } from "react";
import { useAuthLogin } from "./index";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { loadUserFromStorage } = useAuthLogin();

  useEffect(() => {
    loadUserFromStorage();
    // Solo ejecutar una vez al montar. loadUserFromStorage cambia en cada render y causaba loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
