
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Newspaper, LogOut, RefreshCw, ShoppingBag, Package, Menu } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SupabaseSync from "@/services/supabaseSync";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const stats = await SupabaseSync.syncNews();
      toast({
        title: "Синхронізація завершена",
        description: `Завантажено: ${stats.uploaded}, Оновлено: ${stats.updated}, Видалено: ${stats.deleted}, Помилок: ${stats.errors}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Помилка синхронізації",
        description: "Не вдалося синхронізувати дані з базою даних",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-brand-darkBlue text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Адмін Панель</h1>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      )}
      
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar - visible on desktop or when toggled on mobile */}
        <div 
          className={`bg-brand-darkBlue text-white md:w-64 md:min-h-screen md:block transition-all duration-300 ${
            isMobile 
              ? sidebarOpen 
                ? "fixed inset-0 z-50 w-72 overflow-y-auto" 
                : "hidden" 
              : "block"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-6">
            {isMobile && (
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Адмін Панель</h1>
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            )}
            {!isMobile && <h1 className="text-xl font-bold mb-6">Адмін Панель</h1>}
            
            {/* Navigation Menu */}
            <nav className="space-y-2">
              <Link
                to="/admin/news"
                className={`flex items-center p-3 rounded-md transition-colors ${
                  isActive("/admin/news")
                    ? "bg-brand-blue text-white"
                    : "hover:bg-brand-blue/20"
                }`}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <Newspaper className="mr-3 h-5 w-5" />
                Новини
              </Link>
              <Link
                to="/admin/products"
                className={`flex items-center p-3 rounded-md transition-colors ${
                  isActive("/admin/products")
                    ? "bg-brand-blue text-white"
                    : "hover:bg-brand-blue/20"
                }`}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Товари
              </Link>
              <Link
                to="/admin/orders"
                className={`flex items-center p-3 rounded-md transition-colors ${
                  isActive("/admin/orders")
                    ? "bg-brand-blue text-white"
                    : "hover:bg-brand-blue/20"
                }`}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <Package className="mr-3 h-5 w-5" />
                Замовлення
              </Link>
            </nav>
          </div>
          
          {/* Sidebar Footer */}
          <div className="mt-auto p-6 space-y-4">
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              variant="outline"
              className="bg-brand-blue/20 flex items-center justify-center w-full text-white hover:text-[#3A3C99] hover:bg-white"
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
              Синхронізувати
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-brand-blue/20 flex items-center justify-center w-full text-white hover:text-[#3A3C99] hover:bg-white"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Вийти з панелі
            </Button>
          </div>
        </div>
        
        {/* Overlay for mobile when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
