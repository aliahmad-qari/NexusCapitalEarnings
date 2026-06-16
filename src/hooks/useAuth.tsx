import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE } from '../utils/api.ts';

interface User {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referralCount: number;
  wallet: {
    totalBalance: number;
    depositBalance: number;
    profitBalance: number;
    referralEarnings: number;
  };
  investmentGoal?: {
    targetAmount: number;
    targetDate: string;
  };
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Hydrate the session SYNCHRONOUSLY from localStorage on first render. As long
  // as a token + cached user exist, the user is authenticated immediately — there
  // is no async gap during which ProtectedRoute could bounce them to login. This
  // is what makes the session survive a refresh / app reopen.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const token = localStorage.getItem('token');
      const cached = localStorage.getItem('user');
      return token && cached ? (JSON.parse(cached) as User) : null;
    } catch {
      return null;
    }
  });
  // Only show the blocking loader when we have a token but no cached user to show
  // yet (rare). With a cached user, render instantly and revalidate in background.
  const [loading, setLoading] = useState<boolean>(() => {
    const token = localStorage.getItem('token');
    const cached = localStorage.getItem('user');
    return !!token && !cached;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    // Revalidate against the server in the background to pick up DB-level changes
    // (isAdmin, isBlocked, balances). This NEVER clears an already-hydrated session
    // except on a definitive 401/403 (token truly invalid/expired). Transient
    // failures — Render free-tier cold starts (502/503), 500s, offline — keep the
    // cached session intact so the user is not logged out by a temporary blip.
    const init = async () => {
      try {
        const apiBase = API_BASE;
        const res = await fetch(`${apiBase}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const userData = {
            id: data._id,
            name: data.name,
            email: data.email,
            referralCode: data.referralCode,
            referralCount: data.referralCount ?? 0,
            wallet: data.wallet,
            isAdmin: data.isAdmin === true,
            investmentGoal: data.investmentGoal,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else if (res.status === 401 || res.status === 403) {
          // Token genuinely rejected — clear the stale session.
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
        // Any other status (500/502/503/etc.) → keep the cached session as-is.
      } catch {
        // Network error / cold start → keep the cached session; do not log out.
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = (token: string, userData: User) => {
    // Ensure isAdmin is a strict boolean so sidebar checks work correctly
    const normalised = { ...userData, isAdmin: userData.isAdmin === true };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalised));
    setUser(normalised);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const userData = {
          id: data._id,
          name: data.name,
          email: data.email,
          referralCode: data.referralCode,
          referralCount: data.referralCount ?? 0,
          wallet: data.wallet,
          isAdmin: data.isAdmin === true,   // strict boolean, never undefined
          investmentGoal: data.investmentGoal,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
