import { Product, NewsArticle, ProductCategory, ProductDetails } from "../types";

// Product Categories
export const productCategories: ProductCategory[] = [
  {
    id: "vivsyane",
    name: "Вівсяне печиво",
    image: "/1.jpg"
  },
  {
    id: "kukurudziane",
    name: "Кукурудзяне печиво",
    image: "/2.jpg"
  },
  {
    id: "sushka",
    name: "Сушка",
    image: "/3.jpg"
  },
  {
    id: "suhari",
    name: "Сухарі",
    image: "/4.jpg"
  },
  {
    id: "dietychne",
    name: "Дієтичне печиво",
    image: "/5.jpg"
  },
  {
    id: "kondyterski",
    name: "Кондитерські вироби",
    image: "/6.jpg"
  },
  {
    id: "torty",
    name: "Торти і тістечка",
    image: "/placeholder.svg"
  },
  {
    id: "tsukerky",
    name: "Цукерки",
    image: "/placeholder.svg"
  }
];

// Mock Products
export const mockProducts: Product[] = [
  // Вівсяне печиво
  {
    id: "vivsyane-1",
    name: "Вівсяне класичне",
    description: "Класичне вівсяне печиво з натуральних інгредієнтів. Ідеально підходить до чаю чи кави.",
    price: 75,
    image: "/vivsyane-1.jpg",
    additionalImages: [
      "/vivsyane-1-additional-1.jpg",
      "/vivsyane-1-additional-2.jpg",
      "/vivsyane-1-additional-3.jpg"
    ],
    categoryId: "vivsyane",
    inStock: true,
    createdAt: "2023-01-15T08:00:00.000Z",
    details: {
      weight: "300 г",
      expirationDays: 180,
      calories: 370,
      packaging: "Картонна упаковка",
      proteins: 6.2,
      fats: 13.7,
      carbs: 62.5,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі не вище +25°C і відносній вологості повітря не більше 75%",
      ingredients: "Борошно вівсяне, борошно пшеничне вищого ґатунку, цукор, маргарин, яйця, сіль, розпушувач, ванілін",
      piecesInPackage: 15,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  {
    id: "vivsyane-2",
    name: "Вівсяне з родзинками",
    description: "Ароматне вівсяне печиво з додаванням солодких родзинок. Натуральний склад та чудовий смак.",
    price: 85,
    image: "/vivsyane-2.jpg",
    additionalImages: [
      "/vivsyane-2-additional-1.jpg",
      "/vivsyane-2-additional-2.jpg",
      "/vivsyane-2-additional-3.jpg"
    ],
    categoryId: "vivsyane",
    inStock: true,
    createdAt: "2023-01-20T10:30:00.000Z",
    details: {
      weight: "290 г",
      expirationDays: 160,
      calories: 380,
      packaging: "Картонна упаковка",
      proteins: 5.8,
      fats: 14.2,
      carbs: 64.7,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі не вище +25°C і відносній вологості повітря не більше 75%",
      ingredients: "Борошно вівсяне, борошно пшеничне вищого ґатунку, цукор, маргарин, яйця, родзинки, сіль, розпушувач, ванілін",
      piecesInPackage: 14,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  
  // Кукурудзяне печиво
  {
    id: "kukurudziane-1",
    name: "Кукурудзяне печиво класичне",
    description: "Корисне кукурудзяне печиво, виготовлене з високоякісного кукурудзяного борошна.",
    price: 65,
    image: "/kukurudziane-1.jpg",
    additionalImages: [
      "/kukurudziane-1-additional-1.jpg",
      "/kukurudziane-1-additional-2.jpg",
      "/kukurudziane-1-additional-3.jpg"
    ],
    categoryId: "kukurudziane",
    inStock: true,
    createdAt: "2023-02-10T09:45:00.000Z",
    details: {
      weight: "270 г",
      expirationDays: 150,
      calories: 330,
      packaging: "Поліетиленова упаковка",
      proteins: 4.8,
      fats: 10.5,
      carbs: 58.2,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі не вище +25°C і відносній вологості повітря не більше 75%",
      ingredients: "Борошно кукурудзяне, борошно пшеничне вищого ґатунку, цукор, маргарин, яйця, сіль, розпушувач",
      piecesInPackage: 18,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  {
    id: "kukurudziane-2",
    name: "Кукурудзяне печиво з сиром",
    description: "Кукурудзяне печиво з додаванням натурального сиру. Ідеальна закуска для перекусу.",
    price: 75,
    image: "/kukurudziane-2.jpg",
    additionalImages: [
      "/kukurudziane-2-additional-1.jpg",
      "/kukurudziane-2-additional-2.jpg",
      "/kukurudziane-2-additional-3.jpg"
    ],
    categoryId: "kukurudziane",
    inStock: true,
    createdAt: "2023-02-15T14:15:00.000Z",
    details: {
      weight: "250 г",
      expirationDays: 120,
      calories: 345,
      packaging: "Поліетиленова упаковка",
      proteins: 7.3,
      fats: 12.8,
      carbs: 54.6,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі не вище +20°C і відносній вологості повітря не більше 75%",
      ingredients: "Борошно кукурудзяне, борошно пшеничне вищого ґатунку, сир твердий, цукор, маргарин, яйця, сіль, розпушувач",
      piecesInPackage: 16,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  
  // Сушка
  {
    id: "sushka-1",
    name: "Сушка ванільна",
    description: "Традиційна ванільна сушка, виготовлена за класичним рецептом.",
    price: 55,
    image: "/sushka-1.jpg",
    additionalImages: [
      "/sushka-1-additional-1.jpg",
      "/sushka-1-additional-2.jpg",
      "/sushka-1-additional-3.jpg"
    ],
    categoryId: "sushka",
    inStock: true,
    createdAt: "2023-03-05T11:20:00.000Z",
    details: {
      weight: "250 г",
      expirationDays: 180,
      calories: 350,
      packaging: "Картонна коробка",
      proteins: 5.2,
      fats: 12.5,
      carbs: 65.8,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі не вище +25°C і відносній вологості повітря не більше 75%",
      ingredients: "Борошно пшеничне вищого ґатунку, цукор, яйця, маргарин, сіль, ваніль, дріжджі",
      piecesInPackage: 20,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  {
    id: "sushka-2",
    name: "Сушка маленька",
    description: "Маленька сушка - ідеальна для дітей та як додаток до чаю.",
    price: 50,
    image: "/sushka-2.jpg",
    additionalImages: [
      "/sushka-2-additional-1.jpg",
      "/sushka-2-additional-2.jpg",
      "/sushka-2-additional-3.jpg"
    ],
    categoryId: "sushka",
    inStock: true,
    createdAt: "2023-03-10T13:10:00.000Z",
    details: {
      weight: "220 г",
      expirationDays: 180,
      calories: 330,
      packaging: "Картонна коробка",
      proteins: 4.8,
      fats: 11.2,
      carbs: 63.5,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі не вище +25°C і відносній вологості повітря не більше 75%",
      ingredients: "Борошно пшеничне вищого ґатунку, цукор, яйця, маргарин, сіль, ваніль, дріжджі",
      piecesInPackage: 35,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  
  // Сухарі
  {
    id: "suhari-1",
    name: "Сухарі класичні",
    description: "Класичні сухарі, ідеальні для сніданку або перекусу.",
    price: 60,
    image: "/suhari-1.jpg",
    additionalImages: [
      "/suhari-1-additional-1.jpg",
      "/suhari-1-additional-2.jpg",
      "/suhari-1-additional-3.jpg"
    ],
    categoryId: "suhari",
    inStock: true,
    createdAt: "2023-04-20T10:00:00.000Z",
    details: {
      weight: "300 г",
      expirationDays: 200,
      calories: 320,
      packaging: "Поліетиленова упаковка",
      proteins: 7.1,
      fats: 5.8,
      carbs: 71.2,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі не вище +25°C і відносній вологості повітря не більше 75%",
      ingredients: "Борошно пшеничне вищого ґатунку, цукор, яйця, масло вершкове, сіль, дріжджі",
      piecesInPackage: 25,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  {
    id: "suhari-2",
    name: "Сухарі з родзинками",
    description: "Ароматні сухарі з додаванням солодких родзинок.",
    price: 70,
    image: "/suhari-2.jpg",
    additionalImages: [
      "/suhari-2-additional-1.jpg",
      "/suhari-2-additional-2.jpg",
      "/suhari-2-additional-3.jpg"
    ],
    categoryId: "suhari",
    inStock: true,
    createdAt: "2023-04-25T15:30:00.000Z",
    details: {
      weight: "280 г",
      expirationDays: 180,
      calories: 340,
      packaging: "Поліетиленова упаковка",
      proteins: 6.8,
      fats: 6.3,
      carbs: 72.5,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі не вище +25°C і відносній вологості повітря не більше 75%",
      ingredients: "Борошно пшеничне вищого ґатунку, цукор, яйця, масло вершкове, родзинки, сіль, дріжджі",
      piecesInPackage: 22,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  
  // Дієтичне печиво
  {
    id: "dietychne-1",
    name: "Дієтичне печиво без цукру",
    description: "Дієтичне печиво без додавання цукру, ідеальне для тих, хто слідкує за вагою.",
    price: 95,
    image: "/dietychne-1.jpg",
    additionalImages: [
      "/dietychne-1-additional-1.jpg",
      "/dietychne-1-additional-2.jpg",
      "/dietychne-1-additional-3.jpg"
    ],
    categoryId: "dietychne",
    inStock: true,
    createdAt: "2023-05-12T09:00:00.000Z",
    details: {
      weight: "220 г",
      expirationDays: 150,
      calories: 290,
      packaging: "Картонна упаковка",
      proteins: 7.5,
      fats: 8.2,
      carbs: 52.4,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі не вище +22°C і відносній вологості повітря не більше 75%",
      ingredients: "Борошно пшеничне вищого ґатунку, стевія, яйця, маргарин знежирений, сіль, розпушувач, підсолоджувач",
      piecesInPackage: 18,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  {
    id: "dietychne-2",
    name: "Дієтичне вівсяне печиво",
    description: "Низькокалорійне вівсяне печиво для підтримки здорового способу життя.",
    price: 90,
    image: "/dietychne-2.jpg",
    additionalImages: [
      "/dietychne-2-additional-1.jpg",
      "/dietychne-2-additional-2.jpg",
      "/dietychne-2-additional-3.jpg"
    ],
    categoryId: "dietychne",
    inStock: true,
    createdAt: "2023-05-18T14:30:00.000Z",
    details: {
      weight: "230 г",
      expirationDays: 140,
      calories: 310,
      packaging: "Картонна упаковка",
      proteins: 8.3,
      fats: 7.6,
      carbs: 56.8,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі не вище +22°C і відносній вологості повітря не більше 75%",
      ingredients: "Борошно вівсяне, борошно пшеничне цільнозернове, фруктоза, яйця, маргарин знежирений, сіль, розпушувач",
      piecesInPackage: 16,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  
  // Кондитерські вироби
  {
    id: "kondyterski-1",
    name: "Тістечко Наполеон",
    description: "Класичне тістечко Наполеон з ніжним кремом та хрусткими коржами.",
    price: 120,
    image: "/kondyterski-1.jpg",
    additionalImages: [
      "/kondyterski-1-additional-1.jpg",
      "/kondyterski-1-additional-2.jpg",
      "/kondyterski-1-additional-3.jpg"
    ],
    categoryId: "kondyterski",
    inStock: true,
    createdAt: "2023-06-08T10:15:00.000Z",
    details: {
      weight: "150 г",
      expirationDays: 5,
      calories: 420,
      packaging: "Картонна коробка",
      proteins: 5.8,
      fats: 23.4,
      carbs: 48.9,
      storageConditions: "Зберігати у холодильнику при температурі від +2°C до +6°C",
      ingredients: "Борошно пшеничне вищого ґатунку, масло вершкове, молоко, цукор, яйця, ванілін, сіль",
      piecesInPackage: 1,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  {
    id: "kondyterski-2",
    name: "Еклер",
    description: "Французький десерт з заварного тіста з ніжним кремом всередині.",
    price: 110,
    image: "/kondyterski-2.jpg",
    additionalImages: [
      "/kondyterski-2-additional-1.jpg",
      "/kondyterski-2-additional-2.jpg",
      "/kondyterski-2-additional-3.jpg"
    ],
    categoryId: "kondyterski",
    inStock: true,
    createdAt: "2023-06-15T11:45:00.000Z",
    details: {
      weight: "100 г",
      expirationDays: 4,
      calories: 380,
      packaging: "Картонна коробка",
      proteins: 6.2,
      fats: 21.8,
      carbs: 42.5,
      storageConditions: "Зберігати у холодильнику при температурі від +2°C до +6°C",
      ingredients: "Борошно пшеничне вищого ґатунку, масло вершкове, молоко, шоколад, цукор, яйця, ванілін, сіль",
      piecesInPackage: 1,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  
  // Торти і тістечка
  {
    id: "torty-1",
    name: "Торт Київський",
    description: "Знаменитий торт Київський з горіховими коржами та ніжним кремом.",
    price: 350,
    image: "/torty-1.jpg",
    additionalImages: [
      "/torty-1-additional-1.jpg",
      "/torty-1-additional-2.jpg",
      "/torty-1-additional-3.jpg"
    ],
    categoryId: "torty",
    inStock: true,
    createdAt: "2023-07-10T09:30:00.000Z",
    details: {
      weight: "900 г",
      expirationDays: 7,
      calories: 450,
      packaging: "Картонна коробка",
      proteins: 7.8,
      fats: 25.6,
      carbs: 53.2,
      storageConditions: "Зберігати у холодильнику при температурі від +2°C до +6°C",
      ingredients: "Білки яєчні, цукор, горіхи (фундук, кешью), масло вершкове, шоколад, какао, ароматизатори",
      piecesInPackage: 1,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  {
    id: "torty-2",
    name: "Мафіни шоколадні",
    description: "Шоколадні мафіни з шоколадними краплями, ідеальні для святкування.",
    price: 45,
    image: "/torty-2.jpg",
    additionalImages: [
      "/torty-2-additional-1.jpg",
      "/torty-2-additional-2.jpg",
      "/torty-2-additional-3.jpg"
    ],
    categoryId: "torty",
    inStock: true,
    createdAt: "2023-07-15T13:00:00.000Z",
    details: {
      weight: "80 г",
      expirationDays: 10,
      calories: 390,
      packaging: "Картонна коробка",
      proteins: 5.2,
      fats: 18.7,
      carbs: 49.6,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі не вище +22°C",
      ingredients: "Борошно пшеничне вищого ґатунку, шоколад, цукор, яйця, масло вершкове, какао, ванілін, розпушувач",
      piecesInPackage: 1,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  
  // Цукерки
  {
    id: "tsukerky-1",
    name: "Цукерки Асорті",
    description: "Набір різноманітних цукерок у подарунковій коробці.",
    price: 250,
    image: "/tsukerky-1.jpg",
    additionalImages: [
      "/tsukerky-1-additional-1.jpg",
      "/tsukerky-1-additional-2.jpg",
      "/tsukerky-1-additional-3.jpg"
    ],
    categoryId: "tsukerky",
    inStock: true,
    createdAt: "2023-08-05T11:20:00.000Z",
    details: {
      weight: "500 г",
      expirationDays: 120,
      calories: 480,
      packaging: "Подарункова коробка",
      proteins: 4.8,
      fats: 28.3,
      carbs: 63.5,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі від +15°C до +20°C і відносній вологості повітря не більше 75%",
      ingredients: "Шоколад, цукор, глюкозний сироп, молоко згущене, масло какао, горіхи, ароматизатори, наповнювачі",
      piecesInPackage: 24,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  },
  {
    id: "tsukerky-2",
    name: "Цукерки шоколадні",
    description: "Шоколадні цукерки з різноманітними начинками.",
    price: 180,
    image: "/tsukerky-2.jpg",
    additionalImages: [
      "/tsukerky-2-additional-1.jpg",
      "/tsukerky-2-additional-2.jpg",
      "/tsukerky-2-additional-3.jpg"
    ],
    categoryId: "tsukerky",
    inStock: true,
    createdAt: "2023-08-10T15:45:00.000Z",
    details: {
      weight: "350 г",
      expirationDays: 120,
      calories: 520,
      packaging: "Картонна коробка",
      proteins: 5.3,
      fats: 32.1,
      carbs: 59.7,
      storageConditions: "Зберігати у сухому, захищеному від світла місці при температурі від +15°C до +20°C і відносній вологості повітря не більше 75%",
      ingredients: "Шоколад чорний, шоколад молочний, цукор, молоко згущене, масло какао, ароматизатори",
      piecesInPackage: 16,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  }
];

// Mock News Articles
export const mockNewsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Нова лінія дієтичного печива тепер доступна",
    content: "Ми раді повідомити про запуск нової лінії дієтичного печива, яке відрізняється чудовим смаком та низьким вмістом цукру. Наші нові продукти створені з використанням натуральних інгредієнтів та підійдуть для тих, хто слідкує за своїм здоров'ям та фігурою.\n\nНаші клієнти вже відзначають чудовий смак нових продуктів, які не поступаються традиційному печиву. Запрошуємо вас спробувати нашу нову продукцію.",
    summary: "Представляємо нову серію дієтичного печива з натуральних інгредієнтів та низьким вмістом цукру.",
    image: "/news-1.jpg",
    date: "2023-11-15T09:00:00.000Z",
    author: "Відділ маркетингу",
  },
  {
    id: "2",
    title: "Розширення асортименту кондитерських виробів",
    content: "Ми раді повідомити про значне розширення асортименту наших кондитерських виробів. Тепер ви можете знайти ще більше смачних тортів, тістечок та цукерок у нашому каталозі.\n\nНові вироби створені нашими досвідченими кондитерами з використанням найкращих інгредієнтів. Ми впевнені, що вони припадуть до смаку вам та вашим близьким.\n\nЗапрошуємо вас ознайомитися з нашими новинками в розділі 'Кондитерські вироби'.",
    summary: "Розширюємо асортимент кондитерських виробів новими смачними тортами, тістечками та цукерками.",
    image: "/news-2.jpg",
    date: "2023-10-28T14:30:00.000Z",
    author: "Прес-служба",
  },
  {
    id: "3",
    title: "Святкуємо 15 років на ринку кондитерських виробів",
    content: "Цього місяця наша компанія відзначає важливу віху - 15 років успішної діяльності на ринку кондитерських виробів. За ці роки ми пройшли довгий шлях від невеликої пекарні до визнаного виробника якісних кондитерських виробів.\n\nПротягом 15 років наша компанія постійно розвивалася, впроваджувала нові рецепти та розширювала асортимент продукції. Ми пишаємося тим, що змогли завоювати довіру тисяч клієнтів по всій країні.\n\nНа честь цієї видатної дати ми підготували спеціальні пропозиції для наших клієнтів. Протягом наступного місяця ви зможете придбати нашу продукцію зі святковими знижками.",
    summary: "Святкуємо 15-річний ювілей нашої компанії з особливими пропозиціями та знижками для клієнтів.",
    image: "/news-3.jpg",
    date: "2023-09-10T10:15:00.000Z",
    author: "Адміністрація",
  },
];
