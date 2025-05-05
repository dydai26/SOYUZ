import React from "react";
import { ExternalLink, MapPin, Search, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StoreCarousel from "@/components/stores/StoreCarousel";
import { Store } from "@/types";

// Mock store data for physical stores
const physicalStores: Store[] = [
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

// Mock online store data
const onlineStores: Store[] = [
  { id: "1", name: "Zakaz.ua", logo: "/Solid Logo.svg", url: "https://zakaz.ua" },
  { id: "2", name: "МегаМаркет", logo: "/mega.png", url: "https://megamarket.zakaz.ua/uk/search/?q=Союз%20Кондитер" },
  { id: "3", name: "Харків Онлайн", logo: "/kharkiv.png", url: "https://kharkiv.zakaz.ua/uk/search/?q=Союз%20кондитер" },
  { id: "4", name: "За раз", logo: "/zaraz.png", url: "https://zaraz.zakaz.ua/uk/search/?q=союз%20кондитер" },
  { id: "5", name: "Ультрамаркет", logo: "/ultramarket.png", url: "https://ultramarket.zakaz.ua/uk/search/?q=союз%20кондитер" },
  { id: "6", name: "Восторг", logo: "/vostorg.png", url: "https://vostorg.zakaz.ua/uk/search/?q=союз%20кондитер" },
];

const cities = [
  "Київ", "Харків", "Одеса", "Дніпро", "Львів", "Запоріжжя", "Вінниця", "Полтава", "Чернігів"
];

const WhereToBuy = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState<string | null>(null);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Banner Section */}
        <section className="bg-gray-100 py-12" style={{ backgroundImage: 'url("/fon-blue12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
  <div className="container mx-auto">

    {/* Загальний текст про продукцію */}
    <div className="max-w-4xl mx-auto text-center mb-12">
      <p className="text-white text-2xl leading-relaxed text-justify">
        Ласощі ТМ SOYUZ KONDITER доступні в найбільших національних і регіональних торговельних мережах.
        Знайдіть нашу продукцію там, де зручно саме Вам, і насолоджуйтесь справжнім смаком!
      </p>
    </div>

    {/* Онлайн магазини */}
    <div className="flex items-center justify-center mb-12">
      <div className="border-t border-white w-[100px] flex-grow max-w-[100px] mr-4"></div>
      <h2 className="text-4xl font-bold text-center text-white whitespace-nowrap">Онлайн тут</h2>
      <div className="border-t border-white w-[100px] flex-grow max-w-[100px] ml-4"></div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto mb-20">
      {onlineStores.map((store) => (
        <a 
          key={store.id}
          href={store.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-4 rounded-md hover:shadow-md transition-shadow"
        >
          <img 
            src={store.logo} 
            alt={store.name} 
            className="max-w-full max-h-16 object-contain"
          />
        </a>
      ))}
    </div>

    {/* Фізичні магазини */}
    <div className="flex items-center justify-center mb-12">
      <div className="border-t border-white w-[100px] flex-grow max-w-[100px] mr-4"></div>
      <h2 className="text-4xl font-bold text-center text-white whitespace-nowrap">Офлайн тут</h2>
      <div className="border-t border-white w-[100px] flex-grow max-w-[100px] ml-4"></div>
    </div>

    <div className="mb-12">
      <StoreCarousel stores={physicalStores} />
    </div>

    <div className="max-w-4xl mx-auto text-justify mb-20">
      <p className="leading-relaxed text-white">
        Список інтернет-магазинів є орієнтовним і може не включати всі можливі варіанти. 
        Для повнішого пошуку використовуйте пошукові системи. Наша продукція також доступна 
        в роздрібних торгових точках вашого міста. Придбати товар на цьому сайті неможливо; 
        покупка здійснюється через інтернет-магазини за їхніми цінами та умовами.
      </p>
    </div>

    {/* Блок для бізнесу */}
    <div className="bg-white text-gray-800 p-8 rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Замовлення для бізнесу</h2>
      <p className="text-gray-600 mb-4 text-justify">
        Якщо ви власник магазину, кафе, ресторану або іншого бізнесу і хочете закуповувати нашу продукцію оптом, зв'яжіться з нашим відділом продажів.
      </p>
      <p className="text-gray-600 mb-6 text-justify">
        Ми пропонуємо гнучкі умови співпраці, можливість доставки та індивідуальний підхід до кожного клієнта.
      </p>
      <div className="bg-brand-blue/10 p-6 rounded-lg">
        <p className="font-semibold mb-2">Контакти відділу оптових продажів:</p>
        <ul className="space-y-2">
          <li className="flex items-center">
            <Phone className="w-5 h-5 text-brand-blue mr-2" />
            +380 (50) 987-65-43
          </li>
          <li className="flex items-center">
            <Mail className="w-5 h-5 text-brand-blue mr-2" />
            sales@vyrobnykplus.com
          </li>
        </ul>
      </div>
    </div>

  </div>
</section>

      </main>
      <Footer />
    </div>
  );
};

export default WhereToBuy;
