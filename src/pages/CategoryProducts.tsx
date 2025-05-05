
import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProductService } from "@/services/productService";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProductGrid from "@/components/products/ProductGrid";

const CategoryProducts = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  console.log("CategoryProducts - Received categoryId param:", categoryId);
  
  // Використовуємо React Query для отримання даних категорії
  const { 
    data: category,
    isLoading: isCategoryLoading,
    error: categoryError,
    isError: isCategoryError
  } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => ProductService.getCategoryById(categoryId as string),
    enabled: !!categoryId,
  });
  
  // Використовуємо React Query для отримання продуктів за категорією
  const { 
    data: products = [],
    isLoading: isProductsLoading,
    error: productsError,
    isError: isProductsError,
    refetch: refetchProducts
  } = useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => ProductService.getProductsByCategory(categoryId as string),
    enabled: !!categoryId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  
  console.log("CategoryProducts - Category data:", category);
  console.log("CategoryProducts - Products data:", products);
  
  const isLoading = isCategoryLoading || isProductsLoading;
  const error = categoryError || productsError;
  const hasError = isCategoryError || isProductsError;
  
  // Debugging log to see if we have any errors
  if (hasError) {
    console.error("CategoryProducts - Error:", error);
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-[#3A3C99]" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Не вдалося завантажити дані. Спробуйте пізніше.</p>
              <p className="text-sm text-gray-500 mb-4">Деталі помилки: {error?.message}</p>
              <Link to="/catalog" className="text-[#3A3C99] hover:underline flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Повернутися до каталогу
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-16 container">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Категорію не знайдено</h1>
            <p className="mb-4 text-gray-600">Категорія з ID "{categoryId}" не існує або була видалена.</p>
            <Link to="/catalog" className="text-[#3A3C99] hover:underline flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Повернутися до каталогу
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8" style={{ backgroundImage: 'url("/fon-white12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <div className="mb-8">
            <Link to="/catalog" className="text-[#3A3C99] hover:underline flex items-center mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Назад до каталогу
            </Link>
            <h1 className="text-3xl font-bold text-[#3A3C99]">{category.name}</h1>
          </div>
          
          <ProductGrid products={products} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryProducts;
