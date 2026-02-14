"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type StaffLevel = "customer" | "barista" | "owner";

const BARISTA_CODE = "1234";
const OWNER_CODE = "9999";
const STORAGE_KEY = "aegean-staff-level";

const StaffAuthContext = createContext<{
  level: StaffLevel;
  setLevel: (level: StaffLevel) => void;
  checkCode: (code: string) => StaffLevel | null;
  hasBaristaAccess: boolean;
  hasOwnerAccess: boolean;
} | null>(null);

function loadStoredLevel(): StaffLevel {
  if (typeof window === "undefined") return "customer";
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "barista" || stored === "owner") return stored;
  } catch {}
  return "customer";
}

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [level, setLevelState] = useState<StaffLevel>("customer");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLevelState(loadStoredLevel());
    setMounted(true);
  }, []);

  const setLevel = useCallback((newLevel: StaffLevel) => {
    setLevelState(newLevel);
    try {
      sessionStorage.setItem(STORAGE_KEY, newLevel);
    } catch {}
  }, []);

  const checkCode = useCallback((code: string): StaffLevel | null => {
    const trimmed = code.trim();
    if (trimmed === OWNER_CODE) return "owner";
    if (trimmed === BARISTA_CODE) return "barista";
    return null;
  }, []);

  const hasBaristaAccess = level === "barista" || level === "owner";
  const hasOwnerAccess = level === "owner";

  if (!mounted) {
    return (
      <StaffAuthContext.Provider
        value={{
          level: "customer",
          setLevel: () => {},
          checkCode,
          hasBaristaAccess: false,
          hasOwnerAccess: false,
        }}
      >
        {children}
      </StaffAuthContext.Provider>
    );
  }

  return (
    <StaffAuthContext.Provider
      value={{
        level,
        setLevel,
        checkCode,
        hasBaristaAccess,
        hasOwnerAccess,
      }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used within StaffAuthProvider");
  return ctx;
}
