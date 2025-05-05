
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/UserAuthContext";

const personalDataSchema = z.object({
  firstName: z.string().min(2, "Ім'я має містити щонайменше 2 символи"),
  lastName: z.string().min(2, "Прізвище має містити щонайменше 2 символи"),
  email: z.string().email("Введіть дійсну електронну адресу"),
  phone: z.string().min(10, "Номер телефону має містити щонайменше 10 цифр"),
});

type PersonalDataFormValues = z.infer<typeof personalDataSchema>;

interface PersonalDataFormProps {
  onNext: (data: PersonalDataFormValues) => void;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ onNext }) => {
  const { user, profile } = useAuth();
  
  const form = useForm<PersonalDataFormValues>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
    },
  });

  // Update form with user profile data when available
  useEffect(() => {
    if (profile) {
      console.log("Profile data loaded:", profile);
      
      // If profile has full_name, try to split it into first and last name
      if (profile.full_name) {
        const nameParts = profile.full_name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        form.setValue('firstName', firstName);
        form.setValue('lastName', lastName);
      }
      
      if (profile.phone) {
        form.setValue('phone', profile.phone);
      }
      
      // Set the email from user data
      if (user?.email) {
        form.setValue('email', user.email);
      }
    }
  }, [profile, form, user]);

  const onSubmit = (data: PersonalDataFormValues) => {
    console.log("Personal data submitted:", data);
    onNext(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Особисті дані</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ім'я</FormLabel>
                    <FormControl>
                      <Input placeholder="Введіть ваше ім'я" {...field} />
                    </FormControl>
                    {form.formState.errors.firstName && (
                      <p className="text-red-500 text-sm">{form.formState.errors.firstName.message}</p>
                    )}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Прізвище</FormLabel>
                    <FormControl>
                      <Input placeholder="Введіть ваше прізвище" {...field} />
                    </FormControl>
                    {form.formState.errors.lastName && (
                      <p className="text-red-500 text-sm">{form.formState.errors.lastName.message}</p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+380XXXXXXXXX" {...field} />
                  </FormControl>
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
                  )}
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button type="submit" className="w-full">Продовжити</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PersonalDataForm;
