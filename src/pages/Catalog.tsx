
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProductService } from "@/services/productService";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Grid } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Category title images mapping
const categoryImages = {
  vivsyane: "/Viv1.jpg",
  kukurudziane: "/Kuk1.jpg",
  sushka: "/Suchk4.jpg",
  suhari: "/Suhar3.jpg",
  kondyterski: "/Kond1.jpg",
  other: "/17.jpg",
  dietary: "/Die1.jpg",         
  cakes: "/HImage5.jpg",          
  candies: "/sweet1.jpg",
};

const categoryNames = {
  vivsyane: "Вівсяне печиво",
  kukurudziane: "Кукурудзяне печиво",
  sushka: "Сушка",
  suhari: "Сухарі",
  kondyterski: "Кондитерські вироби",
  other: "Інші товари",
  dietary: "Дієтичне печиво",       // нова назва
  cakes: "Торти і тістечка",        // нова назва
  candies: "Цукерки",               // нова назва
};

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const { 
    data: categories = [],
    isLoading,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => ProductService.getCategories(),
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  console.log("Catalog - Categories:", categories);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8" style={{ backgroundImage: 'url("/fon-white12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-12">
              <div className="border-t border-[#3A3C99] w-[100px] flex-grow max-w-[100px] mr-4"></div>
              <h2 className="text-4xl font-bold text-center text-[#3A3C99] whitespace-nowrap">
                {selectedCategory ? categoryNames[selectedCategory] || "Каталог продукції" : "Каталог продукції"}
              </h2>
              <div className="border-t border-[#3A3C99] w-[100px] flex-grow max-w-[100px] ml-4"></div>
            </div>             
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="relative">
                  <Skeleton className="w-full h-[350px]" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Не вдалося завантажити категорії. Спробуйте пізніше.</p>
              <p className="text-sm text-gray-500 mb-4">Деталі помилки: {error?.message}</p>
              <button 
                onClick={() => refetch()} 
                className="px-4 py-2 bg-[#3A3C99] text-white rounded hover:bg-opacity-90"
              >
                Спробувати знову
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Grid className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-medium text-gray-500">Категорії не знайдено</p>
              <p className="text-gray-500 mt-2">На даний момент категорії не доступні.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {categories.map((category) => {
                const categoryKey = Object.keys(categoryNames).find(
                  key => categoryNames[key] === category.name
                );
                const titleImage = categoryKey ? categoryImages[categoryKey] : category.image;

                return (
                  <div key={category.id} className="relative group overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
  <Link to={`/catalog/${category.id}`} className="block">
    <div className="aspect-[4/3] overflow-hidden">
      <img 
        src={titleImage} 
        alt={category.name} 
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
    </div>
    <button className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white inline-block px-8 py-2 max-w-[100%] group-hover:bg-[#3A3C99] transition-colors whitespace-nowrap">
  <h3 className="text-[#3A3C99] text-xl font-semibold group-hover:text-white text-center">
    {category.name.replace(/\s+/g, ' ').trim()}
  </h3>
</button>
  </Link>
</div>

                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
