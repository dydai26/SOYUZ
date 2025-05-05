
import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsCard from "@/components/news/NewsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewsArticle } from "@/types";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      // Отримуємо статті з Supabase
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Мапуємо колонки бази даних на нашу фронтенд модель
        const mappedArticles: NewsArticle[] = data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          summary: item.summary || '',
          author: item.author || '',
          date: item.date,
          image: item.main_image || '/placeholder.svg',
          images: item.images_urls || [],
        }));
        setArticles(mappedArticles);
      } else {
        // Якщо немає даних, показуємо порожній список
        setArticles([]);
        toast({
          description: "Новин не знайдено",
        });
      }
    } catch (error) {
      console.error("Помилка завантаження новин:", error);
      // Показуємо порожній список при помилці
      setArticles([]);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не вдалося завантажити новини",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8" style={{ backgroundImage: 'url("/fon-white12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">Новини та оголошення</h1>

          <div className="mb-8">
            <div className="flex mb-4">
              <Input
                type="text"
                placeholder="Пошук новин..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mr-2"
              />
              <Button>
                <Search className="h-4 w-4 mr-2" /> Пошук
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-3" />
              <span className="text-xl">Завантаження новин...</span>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Новин не знайдено</h3>
              <p className="text-gray-600 mb-4">
                Спробуйте змінити параметри пошуку
              </p>
              <Button onClick={() => setSearchTerm("")}>
                Скинути пошук
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
