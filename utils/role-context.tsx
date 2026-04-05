import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "./auth-context";

export type UserRole = 'DEFAULT' | 'DONOR' | 'RECIPIENT' | 'ADMIN' | 'MIGRANT' | 'DOCTOR' | 'NGO';

type RoleContextType = {
  roles: UserRole[];
  primaryRole: UserRole | null;
  hasRole: (role: UserRole) => boolean;
  isMigrant: boolean;
  isDoctor: boolean;
  isNGO: boolean;
  isDonor: boolean;
  isRecipient: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  refreshRoles: () => Promise<void>;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const normalizeRole = (role: string): UserRole | null => {
    const normalized = String(role || "")
      .trim()
      .toUpperCase()
      .replace(/^ROLE_/, "");
    const allowed: UserRole[] = ["DEFAULT", "DONOR", "RECIPIENT", "ADMIN", "MIGRANT", "DOCTOR", "NGO"];
    return allowed.includes(normalized as UserRole) ? (normalized as UserRole) : null;
  };

  const loadRoles = async () => {
    try {
      const storedRoles = await SecureStore.getItemAsync("roles");
      if (storedRoles) {
        const parsedRoles = JSON.parse(storedRoles) as string[];
        const normalizedRoles = (parsedRoles || [])
          .map((role) => normalizeRole(role))
          .filter((role): role is UserRole => role !== null);
        setRoles(Array.from(new Set(normalizedRoles)));
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error("Error loading roles:", error);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRoles();
    } else {
      setRoles([]);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  const getPrimaryRole = (): UserRole | null => {
    if (roles.length === 0) return null;
    
    const rolePriority: UserRole[] = ['ADMIN', 'DOCTOR', 'NGO', 'MIGRANT', 'DONOR', 'RECIPIENT', 'DEFAULT'];
    
    for (const priorityRole of rolePriority) {
      if (roles.includes(priorityRole)) {
        return priorityRole;
      }
    }
    
    return roles[0];
  };

  return (
    <RoleContext.Provider
      value={{
        roles,
        primaryRole: getPrimaryRole(),
        hasRole,
        isMigrant: hasRole('MIGRANT'),
        isDoctor: hasRole('DOCTOR'),
        isNGO: hasRole('NGO'),
        isDonor: hasRole('DONOR'),
        isRecipient: hasRole('RECIPIENT'),
        isAdmin: hasRole('ADMIN'),
        isLoading,
        refreshRoles: loadRoles,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
