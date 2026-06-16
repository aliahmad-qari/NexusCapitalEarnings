import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    // Always fetch fresh data from the server on startup.
    // This ensures DB-level changes (e.g. isAdmin, isBlocked) are picked up
    // immediately without requiring a logout/login cycle.
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
        } else {
          // Token invalid or expired — clear stale session
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch {
        // Network error — fall back to cached user so the app still works offline
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
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
