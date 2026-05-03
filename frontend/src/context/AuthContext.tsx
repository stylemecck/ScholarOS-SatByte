import { createContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  referralCode?: string;
  referralsCount?: number;
  avatar?: string;
  isGoogleUser?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({ 
          id: res.data._id, 
          name: res.data.name, 
          email: res.data.email, 
          role: res.data.role,
          credits: res.data.credits,
          referralCode: res.data.referralCode,
          referralsCount: res.data.referralsCount,
          avatar: res.data.avatar,
          isGoogleUser: res.data.isGoogleUser
        });
      } catch (err) {
        console.error('Token validation failed');
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkUser();
    
    // Global listener for data refresh
    const handleRefresh = () => checkUser();
    window.addEventListener('user-data-refresh', handleRefresh);
    return () => window.removeEventListener('user-data-refresh', handleRefresh);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
    checkUser(); // Re-fetch to get full user details including credits
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    await checkUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
