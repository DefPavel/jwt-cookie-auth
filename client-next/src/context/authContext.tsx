import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { authService } from '@/services/auth/auth.service';
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  refreshAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const verifyUser = async () => {
    setLoading(true);
    const authStatus = await authService.checkAuth();
    setIsAuthenticated(authStatus?.isValid);
    setLoading(false);
  };

  // Выполняем проверку при монтировании и сохраняем статус
  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, refreshAuthStatus: verifyUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Кастомный хук для использования в компонентах
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
