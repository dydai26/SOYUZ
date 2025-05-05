
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/UserAuthContext';
import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/types/order';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusLabels: Record<string, string> = {
  pending: "Очікує обробки",
  processing: "В обробці",
  completed: "Виконано",
  cancelled: "Скасовано",
  refunded: "Повернено"
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-purple-100 text-purple-800 border-purple-200"
};

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Set timeout to prevent indefinite loading
        const timeoutId = setTimeout(() => {
          setLoading(false);
          setError('Перевищено час очікування. Перевірте підключення до мережі.');
        }, 15000);
        
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        clearTimeout(timeoutId);
          
        if (error) {
          if (error.code === '42P01') { // Table doesn't exist error
            setOrders([]);
          } else {
            throw error;
          }
        } else {
          setOrders(data as Order[]);
        }
      } catch (err: any) {
        console.error('Помилка завантаження замовлень:', err);
        setError(err.message || 'Сталася помилка при завантаженні замовлень');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Завантаження замовлень...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-medium">Помилка: {error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="text-center py-6 text-gray-500">У вас ще немає жодного замовлення</div>;
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-medium mb-4">Історія замовлень</h3>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Замовлення #{order.id.substring(0, 8)}</span>
                  <Badge 
                    variant="outline"
                    className={`${statusColors[order.status]} px-2 py-1`}
                  >
                    {statusLabels[order.status] || order.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString('uk-UA', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="font-bold text-lg">
                {Number(order.total).toLocaleString('uk-UA')} ₴
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Отримувач:</div>
                    <div>{order.full_name}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Телефон:</div>
                    <div>{order.phone}</div>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <div className="text-gray-500">Доставка:</div>
                    <div>{order.shipping_address}</div>
                  </div>
                </div>
                
                {order.items && order.items.length > 0 && (
                  <div className="mt-4">
                    <div className="text-gray-500 mb-2">Товари:</div>
                    <div className="space-y-2">
                      {order.items.map((item: OrderItem) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div>{item.product_name} × {item.quantity}</div>
                          <div>{Number(item.price * item.quantity).toLocaleString('uk-UA')} ₴</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
