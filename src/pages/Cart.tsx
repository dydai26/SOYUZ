import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import PersonalDataForm from "@/components/checkout/PersonalDataForm";
import DeliveryForm from "@/components/checkout/DeliveryForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/UserAuthContext";
import { v4 as uuidv4 } from "uuid";
import { OrderStatus, PaymentMethod } from "@/types";

interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface DeliveryData {
  deliveryMethod: "novaposhta" | "ukrposhta" | "selfpickup";
  city: string;
  address?: string;
  postOffice?: string;
  notes?: string;
}

interface PaymentData {
  paymentMethod: "card" | "cash";
}

interface CheckoutData {
  personalData?: PersonalData;
  deliveryData?: DeliveryData;
  paymentData?: PaymentData;
}

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setCheckoutMode(true);
    } else {
      toast({
        title: "Кошик порожній",
        description: "Додайте товари до кошика перед оформленням замовлення",
        variant: "destructive",
      });
    }
  };

  const handlePersonalDataSubmit = (data: PersonalData) => {
    setCheckoutData({ ...checkoutData, personalData: data });
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeliverySubmit = (data: DeliveryData) => {
    setCheckoutData({ ...checkoutData, deliveryData: data });
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = async (data: PaymentData) => {
    setIsSubmitting(true);
    
    try {
      setCheckoutData({ ...checkoutData, paymentData: data });
      
      const orderData = {
        ...checkoutData,
        paymentData: data,
        items: cartItems,
        totalPrice,
        date: new Date().toISOString(),
      };
      
      console.log("Order completed:", orderData);
      
      // Validate required data
      if (!checkoutData.personalData || !checkoutData.deliveryData) {
        throw new Error("Не хватает данных для оформления заказа");
      }
      
      const fullName = `${checkoutData.personalData.firstName} ${checkoutData.personalData.lastName}`;
      const shippingAddress = formatShippingAddress(checkoutData.deliveryData);
      
      // First ensure the email column exists in the orders table and update schema
      try {
        await supabase.rpc('pgSQL', {
          query: `
            -- Make sure orders table exists
            CREATE TABLE IF NOT EXISTS orders (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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
            
            -- Ensure the email column exists
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT;
            
            -- IMPORTANT: Update order_items table to use TEXT for product_id
            ALTER TABLE IF EXISTS order_items 
            ALTER COLUMN product_id TYPE TEXT 
            USING product_id::text;
            
            -- Recreate order_items table if it doesn't exist with the correct column type
            CREATE TABLE IF NOT EXISTS order_items (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
              product_id TEXT NOT NULL,
              product_name TEXT NOT NULL,
              quantity INTEGER NOT NULL,
              price DECIMAL(10, 2) NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
      } catch (columnError) {
        console.error("Error updating database schema:", columnError);
        // Continue anyway as the tables might already exist
      }
      
      // Create new order in the database
      const orderId = uuidv4();
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: user?.id || null,
          status: 'pending' as OrderStatus,
          total: totalPrice,
          shipping_address: shippingAddress,
          phone: checkoutData.personalData.phone,
          full_name: fullName,
          payment_method: data.paymentMethod as PaymentMethod,
          email: checkoutData.personalData.email,
        });
      
      if (orderError) {
        console.error("Order creation error:", orderError);
        throw new Error(`Помилка створення замовлення: ${orderError.message}`);
      }
      
      // Save order items - ensure product_id is stored as text
      const orderItems = cartItems.map(item => ({
        id: uuidv4(),
        order_id: orderId,
        product_id: String(item.product.id), // Convert to string explicitly
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        console.error("Order items error:", itemsError);
        throw new Error(`Помилка додавання товарів до замовлення: ${itemsError.message}`);
      }
      
      toast({
        title: "Замовлення оформлено!",
        description: "Дякуємо за покупку. Ми зв'яжемося з вами найближчим часом.",
      });
      
      clearCart();
      setCheckoutMode(false);
      setCurrentStep(1);
      setCheckoutData({});
    } catch (error: any) {
      console.error("Ошибка при оформлении заказа:", error);
      toast({
        title: "Помилка оформлення замовлення",
        description: error.message || "Не вдалося оформити замовлення. Спробуйте ще раз пізніше.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatShippingAddress = (deliveryData: DeliveryData): string => {
    switch (deliveryData.deliveryMethod) {
      case 'novaposhta':
        return `Нова пошта, ${deliveryData.city}, Відділення №${deliveryData.postOffice || ''}`;
      case 'ukrposhta':
        return `Укрпошта, ${deliveryData.city}, ${deliveryData.address || ''}`;
      case 'selfpickup':
        return `Самови��із`;
      default:
        return `${deliveryData.city}, ${deliveryData.address || ''}`;
    }
  };

  const goBackToCart = () => {
    setCheckoutMode(false);
  };

  const renderCheckoutStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDataForm 
            onNext={handlePersonalDataSubmit} 
          />
        );
      case 2:
        return (
          <DeliveryForm 
            onNext={handleDeliverySubmit} 
            onBack={() => setCurrentStep(1)} 
          />
        );
      case 3:
        return (
          <PaymentForm 
            onComplete={handlePaymentSubmit} 
            onBack={() => setCurrentStep(2)}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">
            {checkoutMode ? "Оформлення замовлення" : "Кошик"}
          </h1>

          {checkoutMode ? (
            <div className="max-w-3xl mx-auto">
              <CheckoutSteps currentStep={currentStep} />
              {renderCheckoutStep()}
              
              <div className="mt-6 text-center">
                <Button variant="ghost" onClick={goBackToCart} className="text-gray-500">
                  Повернутися до кошика
                </Button>
              </div>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <h2 className="font-semibold">Товари у кошику</h2>
                  </div>

                  <ul>
                    {cartItems.map((item) => {
                      if (!item || !item.product || typeof item.product.price !== 'number') return null;
                      
                      return (
                        <li
                          key={item.product.id}
                          className="p-4 border-b last:border-b-0 flex flex-col sm:flex-row items-start sm:items-center"
                        >
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden mr-4 mb-4 sm:mb-0">
                            <img
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1">
                            <Link
                              to={`/product/${item.product.id}`}
                              className="font-medium hover:text-brand-blue transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-gray-500 mb-2">
                              {item.product.categoryId}
                            </p>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(
                                      item.product.id,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="w-16 border rounded-md p-1 text-center"
                                />
                                <span className="text-gray-500 ml-2">x</span>
                                <span className="font-medium ml-2">
                                  {item.product.price} ₴
                                </span>
                                <span className="font-semibold ml-4">
                                  = {item.product.price * item.quantity} ₴
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 -my-1"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Видалити
                              </Button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button
                    variant="outline"
                    className="text-gray-600"
                    asChild
                  >
                    <Link to="/catalog">
                      <ShoppingBag className="h-4 w-4 mr-2" /> Продовжити покупки
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => clearCart()}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Очистити кошик
                  </Button>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="bg-white rounded-lg border sticky top-24">
                  <div className="p-4 border-b bg-gray-50">
                    <h2 className="font-semibold">Оформлення замовлення</h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Кількість товарів:</span>
                        <span>{cartItems.length}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Загальна сума:</span>
                        <span>{totalPrice} ₴</span>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                    >
                      Оформити замовлення <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Ваш кошик порожній</h2>
              <p className="text-gray-600 mb-8">
                Додайте товари з каталогу, щоб оформити замовлення
              </p>
              <Button asChild>
                <Link to="/catalog">
                  <ShoppingBag className="h-4 w-4 mr-2" /> Перейти до каталогу
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;

