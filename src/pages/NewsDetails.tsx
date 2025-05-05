import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { mockNewsArticles } from "@/services/mockData";
import { NewsArticle } from "@/types";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const NewsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  useEffect(() => {
    fetchArticle();
  }, [id]);
  
  // Оновлюємо поточне зображення коли стаття завантажиться
  useEffect(() => {
    if (article && article.image) {
      setCurrentImage(article.image);
    }
  }, [article]);
  
  const fetchArticle = async () => {
    if (!id) {
      setError("ID статті не вказано");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // Try to get article from Supabase
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Map database columns to our frontend model
        const articleData: NewsArticle = {
          id: data.id,
          title: data.title,
          content: data.content,
          summary: data.summary || '',
          author: data.author || '',
          date: data.date,
          // Map the image fields correctly
          image: data.main_image || '/placeholder.svg',
          images: data.images_urls || [],
        };
        setArticle(articleData);
      } else {
        // Fallback to mock data
        const mockArticle = mockNewsArticles.find((a) => a.id === id);
        if (!mockArticle) {
          setError("Статтю не знайдено");
        } else {
          setArticle(mockArticle);
        }
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      // Fallback to mock data
      const mockArticle = mockNewsArticles.find((a) => a.id === id);
      if (!mockArticle) {
        setError("Статтю не знайдено");
      } else {
        setArticle(mockArticle);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container max-w-4xl">
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-12 w-12 animate-spin mr-3" />
              <span className="text-xl">Завантаження статті...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Статтю не знайдено</h1>
              <p className="mb-6">{error || `Стаття з ID ${id} не існує або була видалена.`}</p>
              <Link
                to="/news"
                className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightBlue transition-colors"
              >
                Повернутися до новин
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = format(new Date(article.date), "d MMMM yyyy", { locale: uk });
  
  // Збираємо всі зображення для галереї
  const allImages = article.images || [];
  // Додаємо основне зображення, якщо воно не дублюється в масиві images
  if (article.image && !allImages.includes(article.image)) {
    allImages.unshift(article.image);
  }
  
  // Якщо немає зображень, додаємо placeholder
  if (allImages.length === 0) {
    allImages.push('/placeholder.svg');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8" style={{ backgroundImage: 'url("/fon-white12.png")', backgroundSize: 'contain', backgroundPosition: 'center' }}>
        <div className="container max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/news"
              className="text-brand-blue hover:underline flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Назад до новин
            </Link>
          </div>

          <article>
            <h1 className="text-3xl font-bold mb-4 text-[#3A3C99]">{article.title}</h1>
            
            <div className="flex items-center text-gray-500 mb-6">
              <span>{formattedDate}</span>
              <span className="mx-2">•</span>
              <span>{article.author}</span>
            </div>

            {/* Галерея зображень */}
            {allImages.length > 0 && (
              <div className="mb-8 flex flex-col md:flex-row gap-4">
                {/* Основне велике зображення з фіксованим розміром */}
                <div className="flex-1 flex justify-center">
                  <div className="w-[700px] h-[700px] overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={currentImage || allImages[0]}
                      alt={article.title}
                      className="w-[700px] h-[700px] object-cover"
                    />
                  </div>
                </div>
                
                {/* Мініатюри справа */}
                {allImages.length > 1 && (
                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-24">
                    {allImages.map((image, index) => (
                      <div 
                        key={index} 
                        className={`overflow-hidden rounded-lg cursor-pointer border-2 ${
                          currentImage === image ? 'border-brand-blue' : 'border-transparent'
                        }`}
                        onClick={() => setCurrentImage(image)}
                      >
                        <img
                          src={image}
                          alt={`${article.title} - зображення ${index + 1}`}
                          className="w-full aspect-square object-cover hover:opacity-90 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="prose max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-[#3A3C99] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetails;
