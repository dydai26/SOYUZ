import React, { useState, useEffect } from "react";
import { Search, CalendarDays, Loader2, RefreshCw, Filter, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { Order, OrderStatus } from "@/types";
import OrderDetails from "@/components/admin/OrderDetails";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-purple-100 text-purple-800 border-purple-200"
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Очікує",
  processing: "Обробляється",
  completed: "Виконано",
  cancelled: "Скасовано",
  refunded: "Повернено"
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    // Abort controller for fetch timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
      // Отримуємо замовлення з Supabase
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);

      if (ordersError) {
        throw ordersError;
      }

      // Додаємо email користувача до кожного замовлення
      if (ordersData && ordersData.length > 0) {
        const ordersWithUserEmails = await Promise.all(
          ordersData.map(async (order) => {
            const orderWithEmail = { ...order };
            
            // If we already have an email in the order, use it for user_email as well
            if (order.email) {
              orderWithEmail.user_email = order.email;
            }
            // Otherwise, try to fetch from user table if we have a user_id
            else if (order.user_id) {
              const { data: userData, error: userError } = await supabase
                .from('auth.users')
                .select('email')
                .eq('id', order.user_id)
                .single();
                
              if (!userError && userData) {
                orderWithEmail.user_email = userData.email;
                // Also set the email field for consistency
                orderWithEmail.email = userData.email;
              }
            }
            
            return orderWithEmail;
          })
        );
        
        setOrders(ordersWithUserEmails as Order[]);
      } else {
        setOrders([]);
      }
    } catch (error: any) {
      console.error("Помилка завантаження замовлень:", error);
      
      // Handle abort errors separately
      if (error.name === "AbortError" || error.message?.includes('Timeout')) {
        setError("Перевищено час очікування відповіді від сервера. Перевірте з'єднання.");
      } else if (error.code === '42P01' || error.message?.includes('не існує')) {
        try {
          // Створюємо таблиці для замовлень та елементів замовлень
          await supabase.rpc('pgSQL', {
            query: `
              CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
              
              -- Створення таблиці для замовлень
              CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID,
                status TEXT NOT NULL DEFAULT 'pending',
                total DECIMAL(10, 2) NOT NULL,
                shipping_address TEXT,
                phone TEXT,
                full_name TEXT,
                payment_method TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                email TEXT
              );
              
              -- Створенн�� таблиці для елементів замовлення
              CREATE TABLE IF NOT EXISTS order_items (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
                product_id UUID NOT NULL,
                product_name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              );
              
              -- Дозволи для таблиці orders
              ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
              ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
              
              -- Тригер для оновлення updated_at при зміні замовлення
              CREATE OR REPLACE FUNCTION update_orders_updated_at()
              RETURNS TRIGGER AS $$
              BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
              END;
              $$ LANGUAGE plpgsql;
              
              CREATE OR REPLACE TRIGGER update_orders_updated_at_trigger
              BEFORE UPDATE ON orders
              FOR EACH ROW
              EXECUTE FUNCTION update_orders_updated_at();
              
              -- RLS політики для адміністраторів
              CREATE POLICY "Allow admins full access" ON orders 
              FOR ALL USING (true) WITH CHECK (true);
              
              CREATE POLICY "Allow admins full access to order items" ON order_items 
              FOR ALL USING (true) WITH CHECK (true);
              
              -- RLS політики для користувачів
              CREATE POLICY "Users can view their own orders" ON orders
                FOR SELECT USING (auth.uid() = user_id);
              
              CREATE POLICY "Users can create their own orders" ON orders
                FOR INSERT WITH CHECK (auth.uid() = user_id);
                
              CREATE POLICY "Users can update their own orders" ON orders
                FOR UPDATE USING (auth.uid() = user_id);
              
              -- Політика для елементів замовлення
              CREATE POLICY "Users can view their own order items" ON order_items
                FOR SELECT USING (
                  EXISTS (
                    SELECT 1 FROM orders
                    WHERE orders.id = order_items.order_id
                    AND orders.user_id = auth.uid()
                  )
                );
              
              CREATE POLICY "Users can insert their own order items" ON order_items
                FOR INSERT WITH CHECK (
                  EXISTS (
                    SELECT 1 FROM orders
                    WHERE orders.id = order_items.order_id
                    AND orders.user_id = auth.uid()
                  )
                );
            `
          });
          
          toast({
            title: "Таблиці замовлень створено",
            description: "Таблиці для замовлень було успішно створено.",
          });
          
          setOrders([]);
        } catch (createError: any) {
          console.error("Помилка створення таблиць замовлень:", createError);
          setError("Не вдалося створити таблиці замовлень: " + (createError.message || ""));
        }
      } else {
        setError(error.message || "Помилка завантаження замовлень");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      toast({
        title: "Статус оновлено",
        description: `Замовлення #${orderId.slice(0, 8)} тепер має статус "${statusLabels[newStatus]}"`,
      });
    } catch (error: any) {
      console.error("Помилка оновлення статусу:", error);
      toast({
        title: "Помилка",
        description: `Не вдалося оновити статус: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    // Фільтр за статусом
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    
    // Пошук за ім'ям, телефоном, адресою або ID
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (order.full_name && order.full_name.toLowerCase().includes(searchLower)) ||
        (order.phone && order.phone.toLowerCase().includes(searchLower)) ||
        (order.shipping_address && order.shipping_address.toLowerCase().includes(searchLower)) ||
        order.id.toLowerCase().includes(searchLower) ||
        (order.email && order.email.toLowerCase().includes(searchLower)) ||
        (order.user_email && order.user_email.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Управління замовленнями</h1>
          <Button onClick={fetchOrders}>
            <RefreshCw className="h-4 w-4 mr-2" /> Оновити
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Пошук замовлень за ім'ям, телефоном, адресою..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Всі статуси" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі статуси</SelectItem>
                  <SelectItem value="pending">Очікує</SelectItem>
                  <SelectItem value="processing">Обробляється</SelectItem>
                  <SelectItem value="completed">Виконано</SelectItem>
                  <SelectItem value="cancelled">Скасовано</SelectItem>
                  <SelectItem value="refunded">Повернено</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" /> Пошук
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-md">
            <p className="font-medium">Помилка: {error}</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={fetchOrders}
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Спробувати знову
            </Button>
          </div>
        )}

        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Замовник</TableHead>
                <TableHead>Контакти</TableHead>
                <TableHead>Сума</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="text-right">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Завантаження замовлень...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.full_name}</div>
                        <div className="text-sm text-gray-500">{order.email || order.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{order.phone}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {order.shipping_address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {Number(order.total).toLocaleString('uk-UA')} грн
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={`${statusColors[order.status]} px-2 py-1`}
                      >
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                        {format(new Date(order.created_at), "d MMMM yyyy", { locale: uk })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-gray-500">Замовлення не знайдено</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {selectedOrder && (
          <OrderDetails 
            order={selectedOrder} 
            onClose={closeOrderDetails} 
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersManagement;
