import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, RegisterData, LoginData } from '../services';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  roles: string[];
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  addRole: (role: 'BUYER' | 'SELLER') => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      setLoading(true);
      // Try to get user from local storage first
      const localUser = await authService.getUserLocally();
      if (localUser) {
        setUser(localUser);
      }

      // Then verify with server
      const meResponse = await authService.me();
      setRoles(meResponse.roles);
    } catch (error) {
      console.log('Not authenticated');
      setUser(null);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      setUser(response.user);
      await loadUser(); // Reload to get roles
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      await loadUser(); // Reload to get roles
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setRoles([]);
    }
  };

  const addRole = async (role: 'BUYER' | 'SELLER') => {
    try {
      await authService.addRole(role);
      await loadUser(); // Reload to get updated roles
    } catch (error) {
      throw error;
    }
  };

  const refreshAuth = async () => {
    await loadUser();
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: user !== null,
    roles,
    login,
    register,
    logout,
    addRole,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
