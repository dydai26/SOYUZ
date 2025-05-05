
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
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Будь ласка, введіть дійсну електронну адресу',
  }),
  password: z.string().min(6, {
    message: 'Пароль повинен містити щонайменше 6 символів',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролі не співпадають",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const { signUp, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const onSubmit = async (values: FormData) => {
    setAuthError(null);
    setSuccess(null);
    
    const { data, error } = await signUp(values.email, values.password);
    
    if (error) {
      if (error.message.includes('already exists')) {
        setAuthError('Користувач з такою електронною адресою вже існує');
      } else if (error.message.includes('confirmation email')) {
        setAuthError('Помилка відправки листа підтвердження. Спробуйте ще раз або використайте іншу адресу.');
      } else {
        setAuthError(error.message);
      }
      return;
    }
    
    if (data.user) {
      setSuccess('Реєстрація успішна! Будь ласка, перевірте вашу пошту для підтвердження акаунта.');
      
      // Опціонально можна перенаправляти на сторінку входу з повідомленням
      setTimeout(() => {
        navigate('/login');
      }, 5000);
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
      const { error } = await resendConfirmationEmail(email);
      if (error) {
        setAuthError(`Помилка відправки листа: ${error.message}`);
      } else {
        setSuccess('Лист з підтвердженням відправлено. Будь ласка, перевірте вашу пошту.');
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
      <h2 className="text-2xl font-bold mb-6 text-center">Реєстрація</h2>
      
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
          {(authError.includes('підтвердження') || authError.includes('confirmation')) && (
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
      
      {success && (
        <Alert variant="default" className="mb-4 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
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
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Підтвердження пароля</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Зареєструватися
          </Button>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            Після реєстрації вам потрібно буде підтвердити вашу електронну адресу.
            Перевірте вашу пошту після реєстрації.
          </p>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
