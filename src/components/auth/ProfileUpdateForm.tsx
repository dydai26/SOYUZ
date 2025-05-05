
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/UserAuthContext';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  full_name: z.string().min(2, {
    message: "Ім'я повинне містити щонайменше 2 символи",
  }).optional(),
  phone: z.string().min(5, {
    message: "Введіть дійсний номер телефону",
  }).optional(),
  address: z.string().min(5, {
    message: "Адреса повинна містити щонайменше 5 символів",
  }).optional(),
});

type FormData = z.infer<typeof formSchema>;

const ProfileUpdateForm = () => {
  const { profile, updateProfile } = useAuth();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    },
  });
  
  const onSubmit = async (values: FormData) => {
    await updateProfile(values);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-xl font-medium mb-4">Редагувати особисті дані</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Повне ім'я</FormLabel>
                <FormControl>
                  <Input placeholder="Іван Петренко" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Номер телефону</FormLabel>
                <FormControl>
                  <Input placeholder="+380123456789" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адреса</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="м. Київ, вул. Хрещатик, 1, кв. 1" 
                    {...field}
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Зберегти зміни
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileUpdateForm;
