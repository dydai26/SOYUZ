
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uk: {
    // Navigation
    home: 'Головна',
    catalog: 'Продукція',
    news: 'Новини',
    about: 'Про нас',
    contacts: 'Контакти',
    whereToBuy: 'Де придбати',
    cart: 'Кошик',
    admin: 'Адмін',
    
    // Hero section
    heroTitle: 'Додайте веселощів у своє життя з ТМ «SOYUZ KONDITER».',
    heroText: 'Приєднуйтесь до нашої спільноти солодкої радості та діліться смаколиками з тими, кого любите. Разом ми створюємо незабутні смакові подорожі',
   
    
    // Home page
    featuredProducts: 'Популярні товари',
    allProducts: 'Всі товари',
    aboutUs: 'Про нас',
    aboutUsShort: 'Компанія ТОВ Виробник Плюс виникла на базі колишнього хлібзаводу у місті Кривий Ріг понад 15 років тому. Її історія почалася з скромних початків, але завдяки наполегливості та професіоналізму засновників,швидко стала визнаним лідером у виробництві кондитерських виробів. Використовуючи сучасні технології та інновації, компанія зберігає традиції якості та надійності.',
    
    learnMore: 'Дізнатися більше',
    ourBenefits: 'Наші переваги',
    quality: 'Якість',
    qualityText: 'Ми виробляємо продукцію лише з натуральних інгредієнтів, без штучних барвників та консервантів',
    delivery: 'Доставка',
    deliveryText: 'Швидка та надійна доставка по всій Україні. Відправка в день замовлення',
    support: 'Підтримка',
    supportText: 'Професійна консультація та підтримка на всіх етапах співпраці',
    whereToBuyText: 'Наша продукція представлена в багатьох супермаркетах та магазинах по всій Україні. Знайдіть найближчу точку продажу наших товарів:',
    allStores: 'Всі точки продажу',
    latestNews: 'Останні новини',
    allNews: 'Всі новини',
    readMore: 'Читати далі',
    contactUs: 'Маєте питання або пропозиції?',
    contactUsText: 'Зв\'яжіться з нами сьогодні, щоб отримати консультацію або дізнатися більше про наші продукти',
    phone: 'Телефон',
    email: 'Email',
    address: 'Адреса',
    contactUsButton: 'Зв\'язатися з нами',
    
    // Product categories
    oatCookies: 'Вівсяне печиво',
    cornCookies: 'Кукурудзяне печиво',
    dryBread: 'Сухарі',
    driedBagel: 'Сушка',
    confectionery: 'Кондитерські вироби',
    candies: 'Цукерки',
    cakesAndPastries: 'Торти і тістечка',
    
    // Catalog page
    searchProducts: 'Пошук товарів...',
    search: 'Пошук',
    filters: 'Фільтри',
    productsShown: 'Показано товарів',
    categories: 'Категорії',
    allCategories: 'Всі категорії',
    availability: 'Наявність',
    inStockOnly: 'Тільки в наявності',
    inStock: 'В наявності',
    outOfStock: 'Немає в наявності',
    productsNotFound: 'Товарів не знайдено',
    tryChangeSearch: 'Спробуйте змінити параметри пошуку або фільтри',
    resetFilters: 'Скинути всі фільтри',
    category: 'Категорія',
    
    // Product details
    backToCatalog: 'Назад до каталогу',
    quantity: 'Кількість',
    addToCart: 'Додати до кошика',
    deliveryCountrywide: 'Доставка по всій Україні',
    shipment: 'Відправка протягом 1-2 робочих днів',
    productNotFound: 'Товар не знайдено',
    productWithIdNotExists: 'Товар з ID не існує або був видалений',
    returnToCatalog: 'Повернутися до каталогу',
    
    // News page
    newsAndAnnouncements: 'Новини та оголошення',
    searchNews: 'Пошук новин...',
    newsNotFound: 'Новин не знайдено',
    tryChangeSearchParams: 'Спробуйте змінити параметри пошуку',
    resetSearch: 'Скинути пошук',
    
    // News details
    backToNews: 'Назад до новин',
    articleNotFound: 'Статтю не знайдено',
    articleWithIdNotExists: 'Стаття з ID не існує або була видалена',
    returnToNews: 'Повернутися до новин',
    
    // Where to buy
    whereToBuyTitle: 'Де придбати нашу продукцію',
    whereToBuyDescription: 'Наша продукція представлена в найбільших торговельних мережах України. Ви можете знайти товари VYROBNYKPLUS у супермаркетах, продуктових магазинах та спеціалізованих кондитерських відділах.',
    searchStores: 'Пошук магазинів...',
    chooseCity: 'Оберіть місто:',
    storesMap: 'Карта магазинів',
    mapWithStoreLocations: 'Карта з розташуванням магазинів',
    businessOrders: 'Замовлення для бізнесу',
    businessOrdersText1: 'Якщо ви власник магазину, кафе, ресторану або іншого бізнесу і хочете закуповувати нашу продукцію оптом, зв\'яжіться з нашим відділом продажів.',
    businessOrdersText2: 'Ми пропонуємо гнучкі умови співпраці, можливість доставки та індивідуальний підхід до кожного клієнта.',
    wholesaleContacts: 'Контакти відділу оптових продажів:',
    goToWebsite: 'Перейти на сайт',
    
    // Cart
    cartTitle: 'Кошик',
    cartItems: 'Товари у кошику',
    continueShopping: 'Продовжити покупки',
    clearCart: 'Очистити кошик',
    checkout: 'Оформлення замовлення',
    itemsCount: 'Кількість товарів:',
    totalAmount: 'Загальна сума:',
    placeOrder: 'Оформити замовлення',
    cartEmpty: 'Ваш кошик порожній',
    addProductsFromCatalog: 'Додайте товари з каталогу, щоб оформити замовлення',
    goToCatalog: 'Перейти до каталогу',
    remove: 'Видалити',
    
    // Footer
    qualityProducts: 'Якісні товари та послуги для вашого бізнесу. Ми пропонуємо широкий асортимент продукції за доступними цінами.',
    navigation: 'Навігація',
    allRightsReserved: 'Всі права захищені.',
    
    // About page
    ourHistory: 'Наша історія',
    historyText1: 'Компанія VYROBNYKPLUS була заснована у 2005 році як невелике виробництво кондитерських виробів. За ці роки ми виросли до сучасного підприємства з повним циклом виробництва та широким асортиментом продукції.',
    historyText2: 'Від початку нашою метою було створення смачних, якісних та доступних солодощів для українських споживачів. Ми пишаємося тим, що зберігаємо традиційні рецепти та водночас впроваджуємо інновації.',
    historyText3: 'Сьогодні VYROBNYKPLUS - це команда професіоналів, сучасне обладнання та натуральні інгредієнти, які дозволяють нам виробляти кондитерські вироби найвищої якості.',
    companyHistory: 'Історія компанії',
    ourMission: 'Наша місія',
    missionText: '"Створювати якісні та смачні кондитерські вироби, сприяти позитивним емоціям та радості в житті наших споживачів"',
    ourProduction: 'Наше виробництво',
    productionText1: 'Виробництво VYROBNYKPLUS оснащене сучасним обладнанням від провідних європейських виробників. Ми суворо дотримуємося всіх санітарних норм та стандартів якості.',
    productionText2: 'Наші технологи постійно працюють над вдосконаленням рецептур та розробкою нових видів продукції. Ми використовуємо лише натуральні інгредієнти та не застосовуємо консерванти.',
    productionText3: 'Контроль якості здійснюється на всіх етапах виробництва: від перевірки сировини до дегустації готової продукції. Наша лабораторія проводить регулярні тестування, щоб гарантувати безпеку та якість кожної партії.',
    productionText4: 'Завдяки цьому підходу, продукція VYROBNYKPLUS відповідає найвищим стандартам якості та має відмінні смакові характеристики.',
    certification: 'Сертифікація',
    certificationText: 'Уся наша продукція сертифікована згідно з українським законодавством та відповідає міжнародним стандартам якості ISO 9001.',
    ecoFriendly: 'Екологічність',
    ecoFriendlyText: 'Ми дбаємо про навколишнє середовище, використовуючи енергоефективне обладнання та екологічно чисті матеріали для упаковки.',
    socialResponsibility: 'Соціальна відповідальність',
    socialResponsibilityText: 'VYROBNYKPLUS регулярно підтримує соціальні проекти та благодійні організації, допомагаючи дитячим будинкам та школам.',
    ourTeam: 'Наша команда',
    teamText: 'Наша команда складається з досвідчених фахівців, які люблять свою справу та постійно вдосконалюють свої навички. Ми створюємо комфортні умови праці та можливості для професійного розвитку.',
    position: 'Посада',
    teamMemberDescription: 'Короткий опис досвіду та експертизи команди',
    
    // Contacts page
    contactsTitle: 'Контакти',
    officeAndProduction: 'Офіс та виробництво',
    workHours: 'Пн-Пт: 9:00 - 18:00',
    responseTime: 'Відповідаємо протягом 24 годин',
    contactForm: 'Зв\'яжіться з нами',
    name: 'Ім\'я',
    subject: 'Тема',
    message: 'Повідомлення',
    sendMessage: 'Надіслати повідомлення',
    sendResume: 'Надіслати резюме',
    resumeText: 'Ми завжди шукаємо талановитих та мотивованих фахівців до нашої команди. Якщо ви бажаєте приєднатися до VYROBNYKPLUS, заповніть форму нижче.',
    desiredPosition: 'Бажана посада',
    resume: 'Резюме (файл)',
    supportedFormats: 'Підтримувані формати: PDF, DOC, DOCX. Макс. розмір: 5MB',
    coverLetter: 'Супровідний лист',
    submitResume: 'Надіслати резюме',
    map: 'Карта',
    mapLocation: 'Тут буде карта з розташуванням',
    
    // Error page
    error404: '404',
    pageNotFound: 'Ой! Сторінку не знайдено',
    returnToHome: 'Повернутися на головну'
  },
  en: {
    // Navigation
    home: 'Home',
    catalog: 'Products',
    news: 'News',
    about: 'About Us',
    contacts: 'Contacts',
    whereToBuy: 'Where to Buy',
    cart: 'Cart',
    admin: 'Admin',
    
    // Hero section
    heroTitle: 'Add joy to your life with «SOYUZ KONDITER».',
    heroText: 'Join our community of sweet joy and share treats with those you love. Together we create unforgettable taste journeys',
    
    
    // Home page
    featuredProducts: 'Featured Products',
    allProducts: 'All Products',
    aboutUs: 'About Us',
    aboutUsShort: 'VYROBNYKPLUS is a modern confectionery production company founded in 2005. Over the years, we have gained a reputation as a reliable producer of quality sweets.',
    
    learnMore: 'Learn more',
    ourBenefits: 'Our Benefits',
    quality: 'Quality',
    qualityText: 'We produce products only from natural ingredients, without artificial colors and preservatives',
    delivery: 'Delivery',
    deliveryText: 'Fast and reliable delivery throughout Ukraine. Same day shipping',
    support: 'Support',
    supportText: 'Professional consultation and support at all stages of cooperation',
    whereToBuyText: 'Our products are presented in many supermarkets and stores throughout Ukraine. Find the nearest point of sale of our products:',
    allStores: 'All points of sale',
    latestNews: 'Latest News',
    allNews: 'All News',
    readMore: 'Read more',
    contactUs: 'Have questions or suggestions?',
    contactUsText: 'Contact us today to get a consultation or learn more about our products',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    contactUsButton: 'Contact us',
    
    // Product categories
    oatCookies: 'Oat Cookies',
    cornCookies: 'Corn Cookies',
    dryBread: 'Dry Bread',
    driedBagel: 'Dried Bagel',
    confectionery: 'Confectionery',
    candies: 'Candies',
    cakesAndPastries: 'Cakes & Pastries',
    
    // Catalog page
    searchProducts: 'Search products...',
    search: 'Search',
    filters: 'Filters',
    productsShown: 'Products shown',
    categories: 'Categories',
    allCategories: 'All categories',
    availability: 'Availability',
    inStockOnly: 'In stock only',
    inStock: 'In stock',
    outOfStock: 'Out of stock',
    productsNotFound: 'Products not found',
    tryChangeSearch: 'Try changing search parameters or filters',
    resetFilters: 'Reset all filters',
    category: 'Category',
    
    // Product details
    backToCatalog: 'Back to catalog',
    quantity: 'Quantity',
    addToCart: 'Add to cart',
    deliveryCountrywide: 'Delivery throughout Ukraine',
    shipment: 'Shipment within 1-2 working days',
    productNotFound: 'Product not found',
    productWithIdNotExists: 'Product with ID does not exist or has been deleted',
    returnToCatalog: 'Return to catalog',
    
    // News page
    newsAndAnnouncements: 'News and announcements',
    searchNews: 'Search news...',
    newsNotFound: 'News not found',
    tryChangeSearchParams: 'Try changing search parameters',
    resetSearch: 'Reset search',
    
    // News details
    backToNews: 'Back to news',
    articleNotFound: 'Article not found',
    articleWithIdNotExists: 'Article with ID does not exist or has been deleted',
    returnToNews: 'Return to news',
    
    // Where to buy
    whereToBuyTitle: 'Where to buy our products',
    whereToBuyDescription: 'Our products are presented in the largest retail chains in Ukraine. You can find VYROBNYKPLUS products in supermarkets, grocery stores and specialized confectionery departments.',
    searchStores: 'Search stores...',
    chooseCity: 'Choose a city:',
    storesMap: 'Stores map',
    mapWithStoreLocations: 'Map with store locations',
    businessOrders: 'Business orders',
    businessOrdersText1: 'If you are a store owner, cafe, restaurant or other business and want to purchase our products wholesale, contact our sales department.',
    businessOrdersText2: 'We offer flexible cooperation terms, delivery options and an individual approach to each client.',
    wholesaleContacts: 'Wholesale department contacts:',
    goToWebsite: 'Go to website',
    
    // Cart
    cartTitle: 'Cart',
    cartItems: 'Cart items',
    continueShopping: 'Continue shopping',
    clearCart: 'Clear cart',
    checkout: 'Checkout',
    itemsCount: 'Number of items:',
    totalAmount: 'Total amount:',
    placeOrder: 'Place order',
    cartEmpty: 'Your cart is empty',
    addProductsFromCatalog: 'Add products from the catalog to place an order',
    goToCatalog: 'Go to catalog',
    remove: 'Remove',
    
    // Footer
    qualityProducts: 'Quality products and services for your business. We offer a wide range of products at affordable prices.',
    navigation: 'Navigation',
    allRightsReserved: 'All rights reserved.',
    
    // About page
    ourHistory: 'Our History',
    historyText1: 'VYROBNYKPLUS company was founded in 2005 as a small confectionery production. Over the years, we have grown into a modern enterprise with a full production cycle and a wide range of products.',
    historyText2: 'From the beginning, our goal was to create delicious, high-quality and affordable sweets for Ukrainian consumers. We are proud to preserve traditional recipes while implementing innovations.',
    historyText3: 'Today VYROBNYKPLUS is a team of professionals, modern equipment and natural ingredients that allow us to produce confectionery products of the highest quality.',
    companyHistory: 'Company history',
    ourMission: 'Our Mission',
    missionText: '"To create quality and delicious confectionery products, to promote positive emotions and joy in the lives of our consumers"',
    ourProduction: 'Our Production',
    productionText1: 'VYROBNYKPLUS production is equipped with modern equipment from leading European manufacturers. We strictly adhere to all sanitary norms and quality standards.',
    productionText2: 'Our technologists are constantly working on improving recipes and developing new types of products. We use only natural ingredients and do not use preservatives.',
    productionText3: 'Quality control is carried out at all stages of production: from checking raw materials to tasting finished products. Our laboratory conducts regular testing to ensure the safety and quality of each batch.',
    productionText4: 'Thanks to this approach, VYROBNYKPLUS products meet the highest quality standards and have excellent taste characteristics.',
    certification: 'Certification',
    certificationText: 'All our products are certified according to Ukrainian legislation and comply with international quality standards ISO 9001.',
    ecoFriendly: 'Eco-friendly',
    ecoFriendlyText: 'We care about the environment by using energy-efficient equipment and environmentally friendly packaging materials.',
    socialResponsibility: 'Social Responsibility',
    socialResponsibilityText: 'VYROBNYKPLUS regularly supports social projects and charitable organizations, helping orphanages and schools.',
    ourTeam: 'Our Team',
    teamText: 'Our team consists of experienced professionals who love their work and constantly improve their skills. We create comfortable working conditions and opportunities for professional development.',
    position: 'Position',
    teamMemberDescription: 'Brief description of team expertise and experience',
    
    // Contacts page
    contactsTitle: 'Contacts',
    officeAndProduction: 'Office and production',
    workHours: 'Mon-Fri: 9:00 - 18:00',
    responseTime: 'We respond within 24 hours',
    contactForm: 'Contact us',
    name: 'Name',
    subject: 'Subject',
    message: 'Message',
    sendMessage: 'Send message',
    sendResume: 'Send resume',
    resumeText: 'We are always looking for talented and motivated professionals for our team. If you want to join VYROBNYKPLUS, fill out the form below.',
    desiredPosition: 'Desired position',
    resume: 'Resume (file)',
    supportedFormats: 'Supported formats: PDF, DOC, DOCX. Max size: 5MB',
    coverLetter: 'Cover letter',
    submitResume: 'Submit resume',
    map: 'Map',
    mapLocation: 'Map location will be here',
    
    // Error page
    error404: '404',
    pageNotFound: 'Oops! Page not found',
    returnToHome: 'Return to Home'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uk');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
