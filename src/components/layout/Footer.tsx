import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#3a3c99] text-white py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img 
              src="/LOGO низ.png" 
              alt="souyz Logo" 
              className="h-[100px] w-auto object-contain"
            />
            <p className="text-3xl m-4">
             Разом смачніше
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Навігація</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-brand-lightBlue transition-colors">
                  Головна
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-brand-lightBlue transition-colors">
                  Продукція
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-brand-lightBlue transition-colors">
                  Новини
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-lightBlue transition-colors">
                  Про нас
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-brand-lightBlue transition-colors">
                  Контакти
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Контакти</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" /> +380 (XX) XXX-XX-XX
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" /> info@vyrobnykplyus.com
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Україна, м. Кривий-ріг
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Соціальні мережі</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100089921524516" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/ecovluu/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.tiktok.com/@Ecovlu" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-white text-center">
          <p>&copy; {new Date().getFullYear()} VYROBNYK PLUS. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
