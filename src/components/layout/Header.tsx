
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/UserAuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-blue-900 text-white h-[55px]">
        <div className="relative container mx-auto flex items-center justify-between h-full px-4">
          <Link to="/" className="absolute -top-0 left-8">
            <img 
              src="/LOGO низ.png" 
              alt="souyz Logo" 
              className="h-[50px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-x-6">
            <Link to="/about" className={`text-1xl  text-white hover:text-gray-200 ${isActive("/about") ? "font-bold" : ""}`}>
              Про нас
            </Link>
            <Link to="/news" className={`text-1xl text-white hover:text-gray-200 ${isActive("/news") ? "font-bold" : ""}`}>
              Новини
            </Link>
            <Link to="/contacts" className={`text-1xl text-white hover:text-gray-200 ${isActive("/contacts") ? "font-bold" : ""}`}>
              Контакти
            </Link>
            <Link to="/where-to-buy" className={`text-1xl text-white hover:text-gray-200 ${isActive("/where-to-buy") ? "font-bold" : ""}`}>
              Де придбати
            </Link>
            <Link to="/catalog" className={`text-1xl text-white hover:text-gray-200 ${isActive("/catalog") ? "font-bold" : ""}`}>
              Продукція
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 ml-auto">
            {/* Shopping Cart icon */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-white hover:text-[#3A3C99] relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* User dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-[#3A3C99]">
                  {user ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer">
                        Особистий кабінет
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Вийти
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="w-full cursor-pointer">
                        Увійти
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="w-full cursor-pointer">
                        Зареєструватися
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Admin panel icon */}
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="text-white hover:text-[#3A3C99]">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            
            {/* Burger menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu} 
              className="text-white min-[941px]:hidden"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation dropdown */}
        {isMenuOpen && (
          <div className="min-[941px]:hidden py-4 bg-blue-900 shadow-lg">
            <div className="container flex flex-col space-y-4">
              <Link to="/about" className="text-white hover:text-gray-200 px-4 py-2" onClick={toggleMenu}>
                Про нас
              </Link>
              <Link to="/news" className="text-white hover:text-gray-200 px-4 py-2" onClick={toggleMenu}>
                Новини
              </Link>
              <Link to="/contacts" className="text-white hover:text-gray-200 px-4 py-2" onClick={toggleMenu}>
                Контакти
              </Link>
              <Link to="/where-to-buy" className="text-white hover:text-gray-200 px-4 py-2" onClick={toggleMenu}>
                Де придбати
              </Link>
              <Link to="/catalog" className="text-white hover:text-gray-200 px-4 py-2" onClick={toggleMenu}>
                Продукція
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Image with Overlay Text */}
      <div className="relative w-full h-[550px] bg-cover bg-center" style={{ backgroundImage: 'url("/контакти-2.jpg")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute top-1/2 left-20 w-[350px] transform -translate-y-1/2 max-w-md p-5 bg-white bg-opacity-80 rounded-lg">
          <h1 className="text-2xl font-bold text-brand-blue mb-4">
            Додайте веселощів у своє життя з ТМ «SOYUZ KONDITER».
          </h1>
          <p className="mb-4">
            Приєднуйтесь до нашої спільноти солодкої радості та діліться смаколиками з тими, кого любите. Разом ми створюємо незабутні смакові подорожі
          </p>
          <div className="flex items-center mt-4">
            <div className="text-white p-2 rounded-full mr-2">
              <img 
                src="/Гасло.png" 
                alt="souyz Logo" 
                className="h-[100px] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
