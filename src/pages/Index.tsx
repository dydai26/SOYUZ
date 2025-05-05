import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, HeartHandshake, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import StoreCarousel from "@/components/stores/StoreCarousel";
import { mockProducts, mockNewsArticles } from "@/services/mockData";
import { NewsArticle } from "@/types";
import { supabase } from "@/lib/supabase";

// Mock store data - in a real app, this would come from a backend
const mockStores = [
  { id: "1", name: "Карамелька", logo: "/karamelka.png", url: "" },
  { id: "2", name: "Тайстра груп", logo: "/taistra.png", url: "" },
  { id: "3", name: "Грош", logo: "/Partners11.png", url: "https://grosh.ua" },
  { id: "4", name: "Коло", logo: "/Partners10.png", url: "https://kolo.ua" },
  { id: "5", name: "Копійка", logo: "/Partners9.png", url: "https://kopijka.ua" },
  { id: "6", name: "Пчілка маркет", logo: "/Partners8 2.png", url: "https://pchilka.ua" },
  { id: "7", name: "Дастор", logo: "/Partners3.png", url: "" },
  { id: "8", name: "Обжора", logo: "/partners-logo-1png@2x.png", url: "" },
  { id: "9", name: "Варус", logo: "/partners-logo-3png@2x.png", url: "" },
  { id: "10", name: "Близенько", logo: "/partners-logo-5png@2x.png", url: "" },
  { id: "11", name: "Делікат", logo: "/Partners1.png", url: "" },
  { id: "12", name: "Сільверленд", logo: "/Partners3 (2).png", url: "" },
  { id: "13", name: "Аврора", logo: "/Partners4.png", url: "" },
  { id: "14", name: "Петрівка", logo: "/Partners5.png", url: "" },
  { id: "15", name: "маркетопт", logo: "/Partners6 2.png", url: "" },
  { id: "16", name: "Алма", logo: "/Partners7.png", url: "" },
];

const Index = () => {
  // Take the 4 most recent products
  const featuredProducts = [...mockProducts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 4);

  const [recentNews, setRecentNews] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  useEffect(() => {
    fetchRecentNews();
  }, []);

  const fetchRecentNews = async () => {
    setIsLoadingNews(true);
    try {
      // Try to get articles from Supabase
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false })
        .limit(3);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Map the database fields to the NewsArticle interface structure
        const mappedArticles = data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          summary: item.summary || '',
          date: item.date,
          author: item.author || '',
          image: item.main_image || item.image_url || "/placeholder.svg",
          images: item.images_urls || item.images || []
        }));
        setRecentNews(mappedArticles);
      } else {
        // Fallback to mock data if Supabase returns empty
        const mockRecent = [...mockNewsArticles]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);
        setRecentNews(mockRecent);
      }
    } catch (error) {
      console.error("Error fetching recent news:", error);
      // Fallback to mock data
      const mockRecent = [...mockNewsArticles]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
      setRecentNews(mockRecent);
    } finally {
      setIsLoadingNews(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">

        {/* Featured Products Section - Updated with 6 containers */}
        <section className="py-16" style={{ backgroundImage: 'url("/fon-white12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              {/* Title with decorative line */}
              <div className="flex items-center justify-center mb-12">
                <div className="border-t border-[#3A3C99] w-[100px] flex-grow max-w-[100px] mr-4"></div>
                <h2 className="text-4xl font-bold text-center text-[#3A3C99] whitespace-nowrap">Каталог продукції</h2>
                <div className="border-t border-[#3A3C99] w-[100px] flex-grow max-w-[100px] ml-4"></div>
              </div>             
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {/* Product Category 1 - Вівсяне */}
              <Link to="/catalog/cat-oatmeal" className="relative group overflow-hidden cursor-pointer">
                <div className="w-full h-full">
                  <img 
                    src="/Viv1.jpg" 
                    alt="Вівсяне печиво" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <div className="bg-white inline-block px-8 py-2 group-hover:bg-[#3A3C99] transition-colors">
                      <span className="text-[#3A3C99] text-xl font-semibold group-hover:text-white transition-colors">ВІВСЯНЕ</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Product Category 2 - Кукурудзяне */}
              <Link to="/catalog/cat-corn" className="relative group overflow-hidden cursor-pointer">
                <div className="w-full h-full">
                  <img 
                    src="/Kuk1.jpg" 
                    alt="Кукурудзяне печиво" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <div className="bg-white inline-block px-8 py-2 group-hover:bg-[#3A3C99] transition-colors">
                      <span className="text-[#3A3C99] text-xl font-semibold group-hover:text-white transition-colors">КУКУРУДЗЯНЕ</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Product Category 3 - Сушка */}
              <Link to="/catalog/cat-sushka" className="relative group overflow-hidden cursor-pointer">
                <div className="w-full h-full">
                  <img 
                    src="/Suchk4.jpg" 
                    alt="Сушка" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <div className="bg-white inline-block px-8 py-2 group-hover:bg-[#3A3C99] transition-colors">
                      <span className="text-[#3A3C99] text-xl font-semibold group-hover:text-white transition-colors">СУШКА</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Product Category 4 - Сухарі */}
              <Link to="/catalog/cat-rusks" className="relative group overflow-hidden cursor-pointer">
                <div className="w-full h-full">
                  <img 
                    src="/Suhar3.jpg" 
                    alt="Сухарі" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <div className="bg-white inline-block px-8 py-2 group-hover:bg-[#3A3C99] transition-colors">
                      <span className="text-[#3A3C99] text-xl font-semibold group-hover:text-white transition-colors">СУХАРІ</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Product Category 5 - Кондитерські вироби */}
              <Link to="/catalog/cat-confectionery" className="relative group overflow-hidden cursor-pointer">
                <div className="w-full h-full">
                  <img 
                    src="/Kond1.jpg" 
                    alt="Кондитерські вироби" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <div className="bg-white inline-block px-8 py-2 group-hover:bg-[#3A3C99] transition-colors">
                      <span className="text-[#3A3C99] text-xl font-semibold group-hover:text-white transition-colors">КОНДИТЕРКА</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Product Category 6 - Інші товари (включають торти та цукерки) */}
              <Link to="/catalog" className="relative group overflow-hidden cursor-pointer">
                <div className="w-full h-full">
                  <img 
                    src="/17.jpg" 
                    alt="Інші товари" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <div className="bg-white inline-block px-8 py-2 group-hover:bg-[#3A3C99] transition-colors">
                      <span className="text-[#3A3C99] text-xl font-semibold group-hover:text-white transition-colors">ІНШІ ТОВАРИ</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
{/* Recent News Section */}
        <section className="py-16" style={{ backgroundImage: 'url("/fon-blue12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Останні новини</h2>
              <Link
                to="/news"
                className="text-white hover:underline flex items-center"
              >
                Всі новини <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            {isLoadingNews ? (
              <div className="flex justify-center items-center py-12">
                <div className="bg-white bg-opacity-20 p-8 rounded-lg">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-4 bg-white bg-opacity-40 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-4 bg-white bg-opacity-40 rounded col-span-2"></div>
                          <div className="h-4 bg-white bg-opacity-40 rounded col-span-1"></div>
                        </div>
                        <div className="h-4 bg-white bg-opacity-40 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
                {recentNews.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden ">
                    <Link to={`/news/${article.id}`}>
                      <div className="relative aspect-video object-cover">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-[450px] overflow-cover transition-transform hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(article.date).toLocaleDateString("uk-UA")}
                      </p>
                      <Link to={`/news/${article.id}`}>
                        <h3 className="text-xl font-semibold mb-2 hover:text-blue-900 transition-colors">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-[#3A3C99] mb-4 line-clamp-2">{article.summary}</p>
                      <Link
                        to={`/news/${article.id}`}
                        className="text-[#3A3C99] hover:underline inline-flex items-center"
                      >
                        Читати далі <ArrowRight className="ml-1 w-4 h-4 " />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* About Us Section */}
<section className="py-16" style={{ backgroundImage: 'url("/fon-white12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
  <div className="container max-w-5xl mx-auto">
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="md:w-full items-center">
        {/* Centered heading with lines */}
        <div className="flex items-center justify-center mb-6">
          <div className="border-t border-[#3A3C99] w-[100px] flex-grow max-w-[100px] mr-4"></div>
          <h2 className="text-4xl text-[#3A3C99] font-bold text-center whitespace-nowrap mr-4">Про нас</h2>
          <div className="border-t border-[#3A3C99] w-[100px] flex-grow max-w-[100px] mr-4"></div>
        </div>

        <p className="text-[#3A3C99] mb-4 text-2xl">
          Компанія ТОВ Виробник Плюс виникла на базі колишнього хлібзаводу у місті Кривий Ріг понад 15 років тому. Її історія почалася з скромних початків, але завдяки наполегливості та професіоналізму засновників, швидко стала визнаним лідером у виробництві кондитерських виробів. Використовуючи сучасні технології та інновації, компанія зберігає традиції якості та надійності.
        </p>

        <Button 
          asChild 
          className="bg-[#3A3C99] text-white hover:bg-[#2D2F7A] transition-colors"
        >
          <Link to="/about">Дізнатися більше <ArrowRight className="ml-1 w-4 h-4" /></Link>
        </Button>
      </div>

      <div className="md:w-1/1 w-full h-full ">
        <img 
          src="/історія.jpg" 
          alt="Про нас" 
          className="rounded-lg shadow-md w-[550px] h-[auto]"
        />
      </div>
    </div>
  </div>
</section>


        {/* Our Benefits Section */}
        <section className="py-16" style={{ backgroundImage: 'url("/fon-blue12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="container">
            {/* Centered heading with lines */}
            <div className="flex items-center justify-center mb-12">
              <div className="border-t border-white w-[100px] flex-grow max-w-[100px] mr-4"></div>
              <h2 className="text-4xl font-bold text-center text-white whitespace-nowrap">Наші переваги</h2>
              <div className="border-t border-white w-[100px] flex-grow max-w-[100px] ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Quality */}
              <div className="flex flex-col items-center text-center">
                <div className="relative h-[160px] w-[200px] flex items-center justify-center mb-6">
                  {/* Star image - you'll add this */}
                  <img src="/Зірка New one.png" alt="" className="absolute inset-0 w-[250px] h-[170px]" />
                  {/* Text positioned on top of star */}
                  <h2 className="text-2xl font-bold text-white relative z-10 drop-shadow-[0_0_2px_black]">ЯКІСТЬ</h2>

                </div>
                <p className="text-white text-center text-xl">
                  Наші клієнти можуть насолоджуватися смачними та вишуканими кондитерськими виробами, виготовленими з урахуванням найвищих стандартів якості.
                </p>
              </div>
              
              {/* Trust and Reliability */}
              <div className="flex flex-col items-center text-center">
                <div className="relative h-[160px] w-[200px] flex items-center justify-center mb-6">
                  {/* Star image - you'll add this */}
                  <img src="/Зірка New one.png" alt="" className="absolute inset-0 w-[250px] h-[180px]" />
                  {/* Text positioned on top of star */}
                  <h2 className="text-2xl font-bold text-white relative z-10 drop-shadow-[0_0_2px_black]">Довіра та<br />надійність</h2>
                </div>
                <p className="text-white text-center text-xl">
                  Компанія "Виробник Плюс" є символом якості та надійності на ринку кондитерської продукції, що дає нашим клієнтам впевненість у виборі наших товарів.
                </p>
              </div>
              
              {/* Local Origin */}
              <div className="flex flex-col items-center text-center">
                <div className="relative h-[160px] w-[200px] flex items-center justify-center mb-6">
                  {/* Star image - you'll add this */}
                  <img src="/Зірка New one.png" alt="" className="absolute inset-0 w-[250px] h-[180px]" />
                  {/* Text positioned on top of star */}
                  <h2 className="text-2xl font-bold text-white relative z-10 drop-shadow-[0_0_2px_black]">Локальне<br />походження</h2>
                </div>
                <p className="text-white text-center text-xl">
                  Наша продукція виготовлена в Україні з використанням українських інгредієнтів, що підкреслює нашу підтримку місцевих виробників та сприяє розвитку економіки країни.
                </p>
              </div>
              
              {/* Customer Service */}
              <div className="flex flex-col items-center text-center">
                <div className="relative h-[160px] w-[200px] flex items-center justify-center mb-6">
                  {/* Star image - you'll add this */}
                  <img src="/Зірка New one.png" alt="" className="absolute inset-0 w-[250px] h-[180px]" />
                  {/* Text positioned on top of star */}
                  <h2 className="text-2xl font-bold text-white relative z-10 drop-shadow-[0_0_2px_black]">Клієнтське<br />обслуговування</h2>
                </div>
                <p className="text-white text-center text-xl">
                  Наша дружня команда завжди готова допомогти та відповісти на всі запитання клієнтів, щоб забезпечити найкращий досвід покупця.
                </p>
              </div>
            </div>
          </div>
        </section>

       
        {/* Where to Buy Section */}
        <section className="py-16 bg-[#3a3c99]">
          <div className="container">
          <div className="flex items-center justify-center mb-12">
              <div className="border-t border-white w-[100px] flex-grow max-w-[100px] mr-4"></div>
              <h2 className="text-4xl font-bold text-center text-white whitespace-nowrap">Де придбати</h2>
              <div className="border-t border-white w-[100px] flex-grow max-w-[100px] ml-4"></div>
            </div>
            
            <StoreCarousel stores={mockStores} />
            <div className="mt-8 text-center">
              <Button 
                asChild 
                className="bg-white text-[#3A3C99] hover:bg-gray-100 border border-[#3A3C99] transition-colors"
              >
                <Link to="/where-to-buy">Всі точки продажу <ArrowRight className="ml-1 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

       

        
      </main>
      <Footer />
    </div>
  );
};

export default Index;
