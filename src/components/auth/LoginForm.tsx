
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Будь ласка, введіть дійсну електронну адресу',
  }),
  password: z.string().min(1, {
    message: 'Будь ласка, введіть пароль',
  }),
});

type FormData = z.infer<typeof formSchema>;

const LoginForm = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (values: FormData) => {
    setAuthError(null);
    const { data, error } = await signIn(values.email, values.password);
    
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setAuthError('Email не підтверджено. Будь ласка, перевірте вашу пошту або натисніть кнопку нижче, щоб відправити лист з підтвердженням ще раз.');
      } else {
        setAuthError(error.message);
      }
      return;
    }
    
    if (data.session && !error) {
      navigate('/profile');
    }
  };

  const handleResendConfirmation = async () => {
    const email = form.getValues('email');
    if (!email) {
      setAuthError('Будь ласка, введіть електронну адресу перед відправкою листа підтвердження.');
      return;
    }
    
    setIsResendingEmail(true);
    try {
      const { error } = await useAuth().resendConfirmationEmail(email);
      if (error) {
        setAuthError(`Помилка відправки листа: ${error.message}`);
      } else {
        setAuthError('Лист з підтвердженням відправлено. Будь ласка, перевірте вашу пошту.');
      }
    } catch (err) {
      setAuthError('Сталася помилка при відправці листа підтвердження.');
      console.error(err);
    } finally {
      setIsResendingEmail(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Вхід</h2>
      
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
          {authError.includes('не підтверджено') && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 w-full" 
              onClick={handleResendConfirmation}
              disabled={isResendingEmail}
            >
              {isResendingEmail ? 'Відправка...' : 'Відправити лист підтвердження'}
            </Button>
          )}
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Електронна пошта</FormLabel>
                <FormControl>
                  <Input placeholder="example@mail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Увійти
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
