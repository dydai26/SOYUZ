-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  image TEXT,
  images TEXT[],
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create a policy for anonymous users to read news
CREATE POLICY "Allow anonymous read access" ON news
  FOR SELECT USING (true);

-- Create a policy for authenticated users to insert, update, and delete news
CREATE POLICY "Allow authenticated users full access" ON news
  FOR ALL USING (auth.role() = 'authenticated');

-- Add some sample data based on the mockNewsArticles
INSERT INTO news (id, title, content, summary, date, image, author)
VALUES 
  ('1', 'Нова лінія дієтичного печива тепер доступна', 'Ми раді повідомити про запуск нової лінії дієтичного печива, яке відрізняється чудовим смаком та низьким вмістом цукру. Наші нові продукти створені з використанням натуральних інгредієнтів та підійдуть для тих, хто слідкує за своїм здоров''ям та фігурою.\n\nНаші клієнти вже відзначають чудовий смак нових продуктів, які не поступаються традиційному печиву. Запрошуємо вас спробувати нашу нову продукцію.', 'Представляємо нову серію дієтичного печива з натуральних інгредієнтів та низьким вмістом цукру.', '2023-11-15T09:00:00.000Z', '/news-1.jpg', 'Відділ маркетингу'),
  
  ('2', 'Розширення асортименту кондитерських виробів', 'Ми раді повідомити про значне розширення асортименту наших кондитерських виробів. Тепер ви можете знайти ще більше смачних тортів, тістечок та цукерок у нашому каталозі.\n\nНові вироби створені нашими досвідченими кондитерами з використанням найкращих інгредієнтів. Ми впевнені, що вони припадуть до смаку вам та вашим близьким.\n\nЗапрошуємо вас ознайомитися з нашими новинками в розділі ''Кондитерські вироби''.', 'Розширюємо асортимент кондитерських виробів новими смачними тортами, тістечками та цукерками.', '2023-10-28T14:30:00.000Z', '/news-2.jpg', 'Прес-служба'),
  
  ('3', 'Святкуємо 15 років на ринку кондитерських виробів', 'Цього місяця наша компанія відзначає важливу віху - 15 років успішної діяльності на ринку кондитерських виробів. За ці роки ми пройшли довгий шлях від невеликої пекарні до визнаного виробника якісних кондитерських виробів.\n\nПротягом 15 років наша компанія постійно розвивалася, впроваджувала нові рецепти та розширювала асортимент продукції. Ми пишаємося тим, що змогли завоювати довіру тисяч клієнтів по всій країні.\n\nНа честь цієї видатної дати ми підготували спеціальні пропозиції для наших клієнтів. Протягом наступного місяця ви зможете придбати нашу продукцію зі святковими знижками.', 'Святкуємо 15-річний ювілей нашої компанії з особливими пропозиціями та знижками для клієнтів.', '2023-09-10T10:15:00.000Z', '/news-3.jpg', 'Адміністрація')
ON CONFLICT (id) DO NOTHING;

-- Create a storage bucket for news images if it doesn't exist
-- Note: This part might need to be executed separately via Supabase dashboard
-- or using the Supabase JS client 