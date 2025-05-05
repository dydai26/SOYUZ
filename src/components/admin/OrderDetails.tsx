
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Order, OrderItem, OrderStatus } from '@/types';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const statusLabels: Record<OrderStatus, string> = {
  pending: "Очікує",
  processing: "Обробляється",
  completed: "Виконано",
  cancelled: "Скасовано",
  refunded: "Повернено"
};

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-purple-100 text-purple-800 border-purple-200"
};

const OrderDetails = ({ order, onClose, onUpdateStatus }: OrderDetailsProps) => {
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleUpdateStatus = async () => {
    if (newStatus === order.status) return;
    
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Sheet open={!!order} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Замовлення #{order.id.slice(0, 8)}</SheetTitle>
          <SheetDescription>
            Створено: {format(new Date(order.created_at), "d MMMM yyyy, HH:mm", { locale: uk })}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Статус замовлення</h4>
              <Badge 
                variant="outline"
                className={`${statusColors[order.status]} px-2 py-1`}
              >
                {statusLabels[order.status]}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Select 
                value={newStatus} 
                onValueChange={(value) => setNewStatus(value as OrderStatus)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Змінити статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Очікує</SelectItem>
                  <SelectItem value="processing">Обробляється</SelectItem>
                  <SelectItem value="completed">Виконано</SelectItem>
                  <SelectItem value="cancelled">Скасовано</SelectItem>
                  <SelectItem value="refunded">Повернено</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                size="sm" 
                disabled={newStatus === order.status || isUpdating} 
                onClick={handleUpdateStatus}
              >
                Зберегти
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-medium">Інформація про замовника</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">ПІБ</div>
                <div>{order.full_name}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Телефон</div>
                <div>{order.phone}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Email</div>
                <div>{order.email || order.user_email || "Не вказано"}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Спосіб оплати</div>
                <div>{order.payment_method === 'card' ? 'Картка' : 
                      order.payment_method === 'cash' ? 'Готівка' : 
                      order.payment_method === 'bank_transfer' ? 'Банківський переказ' : 
                      order.payment_method}</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500 mb-1">Адреса доставки</div>
                <div>{order.shipping_address}</div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-medium">Товари</h4>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item: OrderItem) => (
                  <div key={item.id} className="flex justify-between border-b pb-3">
                    <div>
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-sm text-gray-500">
                        {item.quantity} x {Number(item.price).toLocaleString('uk-UA')} грн
                      </div>
                    </div>
                    <div className="font-medium">
                      {(Number(item.price) * item.quantity).toLocaleString('uk-UA')} грн
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <div className="font-bold">Всього:</div>
                  <div className="font-bold">
                    {Number(order.total).toLocaleString('uk-UA')} грн
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Немає даних про товари в замовленні</div>
            )}
          </div>
        </div>
        
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Закрити</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetails;
