
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

type UserProfile = {
  id: string;
  user_id: string;
  full_name?: string;
  phone?: string;
  address?: string;
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<{ error: any; data: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Встановлюємо таймер для відстеження занадто довгого завантаження
    const loadingTimer = setTimeout(() => {
      // Якщо завантаження триває довше 10 секунд, скидаємо стан завантаження
      if (isLoading) {
        setIsLoading(false);
        console.error("Завантаження сесії тривало занадто довго, скидаємо стан");
      }
    }, 10000);

    // Отримати поточну сесію та встановити слухача для зміни аутентифікації
    const getInitialSession = async () => {
      setIsLoading(true);
      
      try {
        // Встановлюємо таймаут для запиту сесії
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Timeout")), 5000);
        });
        
        // Використовуємо Promise.race для обмеження часу очікування
        const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
        const { data: { session } } = result;
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Помилка отримання сесії:', error);
        // У випадку помилки, вважаємо, що користувач не авторизований
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Встановлення слухача для змін аутентифікації
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      clearTimeout(loadingTimer);
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      // Встановлюємо таймаут для запиту профілю
      const fetchPromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), 5000);
      });
      
      // Використовуємо Promise.race для обмеження часу очікування
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
        
      if (error) {
        // Перевіряємо, чи помилка пов'язана з відсутністю профілю
        if (error.code === 'PGRST116') {
          console.log("Профіль не знайдено, створюємо новий");
          const newProfile = await createUserProfile(userId);
          setProfile(newProfile);
        } else {
          throw error;
        }
      } else if (data) {
        setProfile(data as UserProfile);
      } else {
        // Створити профіль, якщо його ще немає
        const newProfile = await createUserProfile(userId);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Помилка отримання профілю:', error);
    }
  };
  
  const createUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const newProfile = {
        user_id: userId,
      };
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([newProfile])
        .select();
        
      if (error) {
        console.error('Помилка створення профілю:', error);
        
        // Перевіряємо, чи таблиця існує
        if (error.code === '42P01') {
          // Таблиця не існує, створюємо її
          const { error: createTableError } = await supabase.rpc('pgSQL', {
            query: `
              CREATE TABLE IF NOT EXISTS user_profiles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL UNIQUE,
                full_name TEXT,
                phone TEXT,
                address TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              );
            `
          });
          
          if (createTableError) {
            console.error('Помилка створення таблиці профілів:', createTableError);
            return null;
          }
          
          // Пробуємо створити профіль ще раз
          const { data: retryData, error: retryError } = await supabase
            .from('user_profiles')
            .insert([newProfile])
            .select();
            
          if (retryError) {
            console.error('Помилка при повторному створенні профілю:', retryError);
            return null;
          }
          
          return retryData?.[0] as UserProfile;
        }
        
        return null;
      }
      
      return data[0] as UserProfile;
    } catch (error) {
      console.error('Помилка створення профілю:', error);
      return null;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Make email verification optional - comment this out if you want to require email verification
          // emailRedirectTo: window.location.origin + '/login'
        }
      });
      
      if (error) {
        if (error.message.includes('already exists')) {
          toast({
            title: 'Помилка',
            description: 'Користувач з такою електронною адресою вже існує',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Помилка реєстрації',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else if (data.user) {
        toast({
          title: 'Успіх!',
          description: 'Реєстрація успішна. Перевірте вашу пошту для підтвердження.',
        });
        // Профіль буде створено автоматично через слухача auth.onAuthStateChange
      }
      
      return { data, error };
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          // Custom error handling for unconfirmed email
          toast({
            title: 'Помилка входу',
            description: 'Email не підтверджено. Будь ласка, перевірте вашу пошту.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Помилка входу',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Успіх!',
          description: 'Ви успішно увійшли до системи.',
        });
      }
      
      return { data, error };
    } catch (error) {
      console.error('Помилка входу:', error);
      return { data: null, error };
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: window.location.origin + '/login',
        },
      });
      
      if (error) {
        toast({
          title: 'Помилка',
          description: `Не вдалося відправити лист підтвердження: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Лист відправлено',
          description: 'Перевірте вашу пошту для підтвердження акаунта.',
        });
      }
      
      return { data, error };
    } catch (error) {
      console.error('Помилка відправки листа підтвердження:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Вихід',
        description: 'Ви вийшли з облікового запису',
      });
    } catch (error) {
      console.error('Помилка виходу:', error);
    }
  };
  
  const updateProfile = async (data: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Оновлюємо локальний стан профілю
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: 'Профіль оновлено',
        description: 'Ваші дані успішно збережені',
      });
    } catch (error) {
      console.error('Помилка оновлення профілю:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити профіль',
        variant: 'destructive',
      });
    }
  };

  const value = {
    user,
    session,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resendConfirmationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
