
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const deliverySchema = z.object({
  deliveryMethod: z.enum(["novaposhta", "ukrposhta", "selfpickup"]),
  city: z.string().min(2, "Введіть назву міста"),
  address: z.string().optional(),
  postOffice: z.string().optional(),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

interface DeliveryFormProps {
  onNext: (data: DeliveryFormValues) => void;
  onBack: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onNext, onBack }) => {
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      deliveryMethod: "novaposhta",
      city: "",
      address: "",
      postOffice: "",
      postalCode: "",
      notes: "",
    },
  });

  const deliveryMethod = form.watch("deliveryMethod");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Доставка</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Спосіб доставки</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="novaposhta" id="novaposhta" />
                        <Label htmlFor="novaposhta">Нова Пошта</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ukrposhta" id="ukrposhta" />
                        <Label htmlFor="ukrposhta">Укрпошта</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="selfpickup" id="selfpickup" />
                        <Label htmlFor="selfpickup">Самовивіз</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Місто</FormLabel>
                  <FormControl>
                    <Input placeholder="Введіть ваше місто" {...field} />
                  </FormControl>
                  {form.formState.errors.city && (
                    <p className="text-red-500 text-sm">{form.formState.errors.city.message}</p>
                  )}
                </FormItem>
              )}
            />

            {deliveryMethod === "novaposhta" ? (
              <FormField
                control={form.control}
                name="postOffice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Відділення</FormLabel>
                    <FormControl>
                      <Input placeholder="Номер відділення" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : deliveryMethod === "ukrposhta" ? (
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Індекс</FormLabel>
                    <FormControl>
                      <Input placeholder="Поштовий індекс" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адреса</FormLabel>
                    <FormControl>
                      <Input placeholder="Введіть вашу адресу" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примітки до замовлення</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Вкажіть додаткову інформацію щодо доставки за потреби" 
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Назад
              </Button>
              <Button type="submit">Продовжити</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DeliveryForm;
