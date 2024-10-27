import { FC, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Spinner from '@/components/ui/spinner';
import { useAuth } from '@/context/authContext';

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  // Состояние для контроля готовности, чтобы не увидеть контент страницы
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (loading) return; // Если происходит загрузка, ничего не делаем
      if (!isAuthenticated) {
        // Перенаправляем на страницу авторизации
        router.push('/auth');
        return;
      }
      // Устанавливаем состояние готовности, если пользователь авторизован
      setIsReady(true);
    };

    checkAuth();
  }, [isAuthenticated, loading, router]);

  // Пока происходит загрузка, показываем спиннер
  if (loading || !isReady) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  // Если авторизован и готов, отдаем дочерние элементы
  return <>{children}</>;
};

export default ProtectedRoute;
