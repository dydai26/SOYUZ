
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, CalendarDays, Loader2, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { NewsArticle } from "@/types";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

const NewsManagement = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    
    // Abort controller for fetch timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
      // Спрощений запит без Promise.race для кращого зловлення помилок
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });
        
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);

      if (error) {
        throw error;
      }

      // Перевіряємо, чи є хоча б одна новина у даних
      console.log("Отримано даних:", data?.length || 0);
      
      if (data && data.length > 0) {
        // Мапуємо колонки бази даних на нашу фронтенд модель
        const mappedArticles: NewsArticle[] = data.map(item => ({
          id: item.id || `news-${Date.now()}`,
          title: item.title || 'Без заголовку',
          content: item.content || '',
          summary: item.summary || '',
          author: item.author || '',
          date: item.date || new Date().toISOString(),
          image: item.main_image || item.image_url || "/placeholder.svg",
          images: item.images_urls || item.images || [],
        }));
        setArticles(mappedArticles);
      } else {
        // Якщо немає даних, показуємо порожній список
        setArticles([]);
        console.log("Немає новин у базі даних");
      }
    } catch (error: any) {
      console.error("Помилка завантаження новин:", error);
      
      // Handle abort errors separately
      if (error.name === "AbortError" || error.message?.includes('Timeout')) {
        setError("Перевищено час очікування відповіді від сервера. Перевірте з'єднання.");
      } else if (error.code === '42P01' || error.message?.includes('не існує')) {
        try {
          await supabase.rpc('pgSQL', {
            query: `
              CREATE TABLE IF NOT EXISTS news (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                summary TEXT,
                date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                author TEXT,
                main_image TEXT,
                images_urls TEXT[]
              );
            `
          });
          
          // Встановлюємо порожній список новин
          setArticles([]);
          
          toast({
            title: "Таблицю новин створено",
            description: "Таблицю новин було успішно створено. Додайте першу новину.",
          });
        } catch (createError: any) {
          console.error("Помилка створення таблиці:", createError);
          setError("Не вдалося створити таблицю новин: " + (createError.message || ""));
        }
      } else {
        setError(error.message || "Помилка завантаження новин");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDeleteArticle = (id: string) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    
    try {
      // Видаляємо з Supabase
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', articleToDelete);

      if (error) {
        throw error;
      }

      // Оновлюємо локальний стан
      setArticles(prevArticles => 
        prevArticles.filter((article) => article.id !== articleToDelete)
      );
      
      toast({
        title: "Новину видалено",
        description: "Новина була успішно видалена з системи",
      });
    } catch (error: any) {
      console.error("Помилка видалення новини:", error);
      toast({
        title: "Помилка видалення",
        description: "Не вдалося видалити новину: " + (error.message || "Спробуйте ще раз."),
        variant: "destructive"
      });
    } finally {
      setArticleToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Управління новинами</h1>
          <Button asChild className="w-full md:w-auto">
            <Link to="/admin/news/new">
              <Plus className="h-4 w-4 mr-2" /> Додати новину
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Пошук новин..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:mr-2"
            />
            <Button className="w-full sm:w-auto">
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
              onClick={fetchArticles}
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Спробувати знову
            </Button>
          </div>
        )}

        {isMobile ? (
          // Mobile card view
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Завантаження новин...</span>
              </div>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg border p-4 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 rounded overflow-hidden mr-3">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium truncate">{article.title}</h3>
                      <p className="text-sm text-gray-500">{article.author}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {format(new Date(article.date), "d MMMM yyyy", { locale: uk })}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link to={`/admin/news/edit/${article.id}`}>
                        <Pencil className="h-4 w-4 mr-1" /> Редагувати
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-1"
                      onClick={() => confirmDeleteArticle(article.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Видалити
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white border rounded-lg">
                <div className="text-gray-500">Новини не знайдено</div>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  asChild
                >
                  <Link to="/admin/news/new">
                    Створити першу новину
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Desktop table view
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead className="min-w-[300px]">Заголовок</TableHead>
                  <TableHead>Автор</TableHead>
                  <TableHead>Дата публікації</TableHead>
                  <TableHead className="text-right">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Завантаження новин...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-gray-100 mr-3 overflow-hidden flex-shrink-0">
                            <img
                              src={article.image || "/placeholder.svg"}
                              alt={article.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="truncate max-w-[300px]">{article.title}</div>
                        </div>
                      </TableCell>
                      <TableCell>{article.author}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                          {format(new Date(article.date), "d MMMM yyyy", { locale: uk })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/admin/news/edit/${article.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => confirmDeleteArticle(article.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-gray-500">Новини не знайдено</div>
                      <Button 
                        className="mt-4" 
                        variant="outline"
                        asChild
                      >
                        <Link to="/admin/news/new">
                          Створити першу новину
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
              <AlertDialogDescription>
                Ця дія видалить новину назавжди. Цю дію неможливо скасувати.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Скасувати</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteArticle}
                className="bg-red-500 hover:bg-red-600"
              >
                Видалити
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default NewsManagement;
