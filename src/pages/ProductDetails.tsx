import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Package, Calendar, CheckCircle, XCircle, Loader2, Weight, Info, ListChecks, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { ProductService } from "@/services/productService";
import { Product, ProductCategory, ProductDetails as ProductDetailsType } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const productData = await ProductService.getProductById(id);
        
        if (productData) {
          setProduct(productData);
          setSelectedImage(productData.image || null);
          
          if (productData.categoryId) {
            const categoryData = await ProductService.getCategoryById(productData.categoryId);
            setCategory(categoryData);
          }
        } else {
          setError("Товар не знайдено");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Не вдалося завантажити дані товару");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Товар додано до кошика",
        description: `${product.name} (${quantity} шт.)`,
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            <Skeleton className="h-6 w-32 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="aspect-square w-full" />
              <div>
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-6" />
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">{error || "Товар не знайдено"}</h1>
              <p className="mb-6">Товар з ID {id} не існує або був видалений.</p>
              <Button asChild>
                <Link to="/catalog">Повернутися до каталогу</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Extract product details or use default values
  const details = product.details || {} as ProductDetailsType;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8" style={{ backgroundImage: 'url("/fon-white12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container max-w-[1200px] mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to={category ? `/catalog/${category.id}` : "/catalog"}
              className="text-brand-blue hover:underline flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> 
              {category ? `Назад до ${category.name}` : 'Назад до каталогу'}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Product Images - Left Side */}
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="rounded-md overflow-hidden border cursor-pointer mb-3">
                    <img
                      src={selectedImage || product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-[450px] object-cover"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={selectedImage || product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="max-h-[70vh] object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2">
                <div 
                  className={`border rounded overflow-hidden cursor-pointer aspect-square ${selectedImage === product.image ? 'ring-2 ring-[#3A3C99] ring-opacity-60' : ''}`}
                  onClick={() => handleImageClick(product.image)}
                >
                  <img 
                    src={product.image || "/placeholder.svg"} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {product.additionalImages && product.additionalImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`border rounded overflow-hidden cursor-pointer aspect-square ${selectedImage === image ? 'ring-2 ring-[#3A3C99] ring-opacity-60' : ''}`}
                    onClick={() => handleImageClick(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - фото ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info - Right Side */}
            <div>
              <h1 className="text-3xl font-bold mb-2 text-[#3A3C99]">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                {product.inStock ? (
                  <div className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-md inline-flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> В наявності
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-md inline-flex items-center">
                    <XCircle className="h-4 w-4 mr-1" /> Немає в наявності
                  </div>
                )}
               
              </div>
              
              <p className=" mb-6 text-[#3A3C99]">{product.description}</p>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-indigo-700 mb-4">
                  {product.price.toLocaleString()} грн
                </div>

                <div className="flex space-x-2">
                  <div className="w-24">
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      className="w-full border rounded-md p-2"
                      disabled={!product.inStock}
                    />
                  </div>

                  <Button
                    className="flex-1 bg-indigo-700 hover:bg-indigo-800"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Додати до кошика
                  </Button>
                </div>
              </div>
              
              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Weight className="h-5 w-5 text-[#3A3C99] mr-2" />
                  <span>Вага: {details?.weight || "100 г"}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-[#3A3C99] mr-2" />
                  <span>
                    Термін придатності: {details?.expirationDays || 4} {getExpirationText(details?.expirationDays || 4)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-[#3A3C99] mr-2" />
                  <span>
                    Енергетична цінність: {details?.calories || 380} ккал/100г
                  </span>
                </div>
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-[#3A3C99] mr-2" />
                  <span>
                    Упакування: {details?.packaging || "Картонна коробка"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="characteristics">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-6">
                <TabsTrigger value="characteristics" className="flex items-center text-[#3A3C99]">
                  <ListChecks className="h-4 w-4 mr-2 text-[#3A3C99]" /> Характеристики
                </TabsTrigger>
                <TabsTrigger value="shipping" className="flex items-center text-[#3A3C99]">
                  <Truck className="h-4 w-4 mr-2 text-[#3A3C99]" /> Доставка
                </TabsTrigger>
                <TabsTrigger value="payment" className="flex items-center text-[#3A3C99]">
                  <CreditCard className="h-4 w-4 mr-2 text-[#3A3C99]" /> Оплата
                </TabsTrigger>
                <TabsTrigger value="ordering" className="flex items-center text-[#3A3C99]">
                  <ShoppingCart className="h-4 w-4 mr-2 text-[#3A3C99]" /> Умови замовлення
                </TabsTrigger>
              </TabsList>
              
              {/* Product Characteristics Tab */}
              <TabsContent value="characteristics" className="border border-[#3A3C99] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Характеристики продукту</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Загальна інформація</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                        <span className="text-gray-600">Назва:</span>
                        <span className="font-medium">{product.name}</span>
                      </li>
                      <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                        <span className="text-gray-600">Категорія:</span>
                        <span className="font-medium">{category?.name}</span>
                      </li>
                      <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                        <span className="text-gray-600">Артикул:</span>
                        <span className="font-medium">{product.id}</span>
                      </li>
                      {details?.manufacturer && (
                        <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                          <span className="text-gray-600">Виробник:</span>
                          <span className="font-medium">{details.manufacturer}</span>
                        </li>
                      )}
                      {details?.countryOfOrigin && (
                        <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                          <span className="text-gray-600">Країна виробництва:</span>
                          <span className="font-medium">{details.countryOfOrigin}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Склад і харчова цінність</h4>
                    <ul className="space-y-2">
                      {details?.weight && (
                        <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                          <span className="text-gray-600">Вага:</span>
                          <span className="font-medium">{details.weight}</span>
                        </li>
                      )}
                      {details?.piecesInPackage && (
                        <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                          <span className="text-gray-600">Кількість штук в упаковці:</span>
                          <span className="font-medium">{details.piecesInPackage} шт</span>
                        </li>
                      )}
                      {details?.calories && (
                        <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                          <span className="text-gray-600">Енергетична цінність:</span>
                          <span className="font-medium">{details.calories} ккал/100г</span>
                        </li>
                      )}
                      {details?.proteins && (
                        <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                          <span className="text-gray-600">Білки:</span>
                          <span className="font-medium">{details.proteins} г/100г</span>
                        </li>
                      )}
                      {details?.fats && (
                        <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                          <span className="text-gray-600">Жири:</span>
                          <span className="font-medium">{details.fats} г/100г</span>
                        </li>
                      )}
                      {details?.carbs && (
                        <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                          <span className="text-gray-600">Вуглеводи:</span>
                          <span className="font-medium">{details.carbs} г/100г</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {(details?.expirationDays || details?.storageConditions || details?.packaging) && (
                    <div className="md:col-span-2">
                      <h4 className="font-medium mb-2">Зберігання</h4>
                      <ul className="space-y-2">
                        {details?.expirationDays && (
                          <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                            <span className="text-gray-600">Термін придатності:</span>
                            <span className="font-medium">{details.expirationDays} днів</span>
                          </li>
                        )}
                        {details?.storageConditions && (
                          <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                            <span className="text-gray-600">Умови зберігання:</span>
                            <span className="font-medium">{details.storageConditions}</span>
                          </li>
                        )}
                        {details?.packaging && (
                          <li className="flex justify-between border-b border-[#3A3C99] pb-2">
                            <span className="text-gray-600">Упаковка:</span>
                            <span className="font-medium">{details.packaging}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {/* 
{details?.ingredients && (
  <div className="md:col-span-2">
    <h4 className="font-medium mb-2">Склад</h4>
    <p className="text-gray-800">{details.ingredients}</p>
  </div>
)}
*/}
                </div>
              </TabsContent>
              
              {/* Shipping Tab */}
              <TabsContent value="shipping" className="border border-[#3A3C99] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Умови доставки</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Доставка по Україні</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Нова Пошта - 1-3 дні</li>
                      <li>Укрпошта - 3-7 днів</li>
                      <li>Meest Express - 2-4 дні</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Доставка по Києву</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Кур'єрська доставка - доставка в день замовлення або на наступний день</li>
                      <li>Самовивіз з нашого магазину - безкоштовно</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Вартість доставки</h4>
                    <p>Вартість доставки залежить від обраного способу доставки та регіону.</p>
                    <p className="mt-2">При замовленні від 1000 грн доставка Новою Поштою безкоштовна.</p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Payment Tab */}
              <TabsContent value="payment" className="border border-[#3A3C99] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Умови оплати</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Способи оплати</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Оплата при отриманні (накладений платіж)</li>
                      <li>Онлайн-оплата карткою Visa/MasterCard</li>
                      <li>Оплата через Apple Pay / Google Pay</li>
                      <li>Банківський переказ для юридичних осіб</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Безпека платежів</h4>
                    <p>Всі платежі обробляються через захищені канали з використанням сучасних технологій шифрування. Ми не зберігаємо дані ваших банківських карт.</p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Ordering Tab */}
              <TabsContent value="ordering" className="border border-[#3A3C99] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Умови замовлення</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Як зробити замовлення</h4>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Виберіть потрібні товари та додайте їх у кошик</li>
                      <li>Перейдіть у кошик та перевірте замовлення</li>
                      <li>Натисніть кнопку "Оформити замовлення"</li>
                      <li>Заповніть форму з контактними даними та адресою доставки</li>
                      <li>Виберіть спосіб доставки та оплати</li>
                      <li>Підтвердіть замовлення</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Мінімальна сума замовлення</h4>
                    <p>Мінімальна сума замовлення для відправки - 200 грн.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Оптові замовлення</h4>
                    <p>Для оптових замовлень, будь ласка, зв'яжіться з нашим відділом продажів за телефоном +380 (XX) XXX-XX-XX або відправте запит на електронну пошту sales@vyrobnykplus.com.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Скасування замовлення</h4>
                    <p>Ви можете скасувати замовлення до моменту його відправки, зв'язавшись з нашим сервісним центром.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Helper function to get the correct form of the word based on the number
function getExpirationText(days: number): string {
  if (days % 10 === 1 && days % 100 !== 11) {
    return "день";
  } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
    return "дні";
  } else {
    return "днів";
  }
}

export default ProductDetails;
