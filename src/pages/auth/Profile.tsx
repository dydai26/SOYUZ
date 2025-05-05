
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/UserAuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileUpdateForm from '@/components/auth/ProfileUpdateForm';
import OrderHistory from '@/components/auth/OrderHistory';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, signOut, isLoading } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const { toast } = useToast();
  
  // Встановлюємо таймер для відстеження довгого завантаження
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 3000); // Зменшуємо до 3 секунд для швидшого відображення повідомлення
      
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  // Функція повернення на головну сторінку
  const handleGoHome = () => {
    window.location.href = '/';
  };

  // Спробувати ще раз
  const handleRetry = () => {
    window.location.reload();
  };

  // Якщо завантаження не закінчилося, показуємо індикатор
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-lg">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <div className="text-xl font-bold mb-2">Завантаження...</div>
            
            {loadingTimeout && (
              <div className="mt-6">
                <p className="text-red-600 mb-4">
                  Завантаження триває довше, ніж очікувалося. Можливо, виникли проблеми з підключенням до сервера.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleGoHome}>
                    На головну
                  </Button>
                  <Button onClick={handleRetry}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Спробувати ще раз
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Якщо користувач не авторизований, перенаправляємо на сторінку входу
  if (!user) {
    toast({
      title: "Необхідна авторизація",
      description: "Для доступу до особистого кабінету необхідно увійти в систему",
    });
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Особистий кабінет</h1>
            <Button variant="outline" onClick={signOut}>Вийти</Button>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">{user.email}</h2>
            </div>
            
            <div className="p-6">
              <Tabs defaultValue="orders">
                <TabsList className="mb-6">
                  <TabsTrigger value="orders">Мої замовлення</TabsTrigger>
                  <TabsTrigger value="profile">Особисті дані</TabsTrigger>
                </TabsList>
                
                <TabsContent value="orders">
                  <OrderHistory />
                </TabsContent>
                
                <TabsContent value="profile">
                  <ProfileUpdateForm />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
