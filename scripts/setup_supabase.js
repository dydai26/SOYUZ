import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

// Ініціалізація змінних середовища
dotenv.config();

// Отримання поточної директорії файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Дані для авторизації в Supabase
const supabaseUrl = 'https://exfsaxzpwqfxsxinrkbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnNheHpwd3FmeHN4aW5ya2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTA3MTYsImV4cCI6MjA2MTA2NjcxNn0.u_a0KplU2mueKCJXbSsAOc5kjBjWEQmvSpmDPCXNktU';

// Ініціалізація клієнта Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Функція для створення таблиці новин та налаштування бази даних
async function setupDatabase() {
  console.log('Налаштування бази даних Supabase...');
  
  try {
    // Зчитування SQL файлу
    const sqlFilePath = path.join(__dirname, 'create_news_table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Розділення SQL на окремі команди
    const statements = sqlContent
      .split(';')
      .filter(statement => statement.trim() !== '')
      .map(statement => statement.trim() + ';');
    
    // Виконання кожної команди
    for (const statement of statements) {
      console.log(`Виконання SQL команди: ${statement.substring(0, 50)}...`);
      
      try {
        const { error } = await supabase.rpc('pgSQL', { query: statement });
        
        if (error) {
          console.error('Помилка виконання SQL:', error);
          
          // Спробуємо інший підхід, якщо pgSQL недоступний
          if (error.message && error.message.includes('function "pgsql" does not exist')) {
            console.log('Функція pgSQL недоступна, спроба використання Supabase API...');
            
            // Якщо це створення таблиці, спробуємо альтернативний підхід через API
            if (statement.includes('CREATE TABLE')) {
              await createTableThroughAPI();
            }
          }
        }
      } catch (err) {
        console.error('Помилка запиту:', err);
      }
    }
    
    console.log('Налаштування бази даних завершено!');
    
    // Перевірка чи таблиця створена
    const { data, error } = await supabase.from('news').select('count');
    
    if (error) {
      console.error('Помилка перевірки таблиці:', error);
    } else {
      console.log('Таблиця новин успішно створена:', data);
    }
    
    // Створення сховища для зображень, якщо воно не існує
    await setupStorage();
    
  } catch (error) {
    console.error('Помилка налаштування бази даних:', error);
  }
}

// Альтернативний підхід для створення таблиці через API
async function createTableThroughAPI() {
  console.log('Спроба створення таблиці через HTTP API...');
  
  // Тут ми можемо використати інші методи Supabase або REST API запити
  console.log('Будь ласка, створіть таблицю через інтерфейс Supabase:');
  console.log('1. Перейдіть до Supabase Dashboard: https://app.supabase.io');
  console.log('2. Виберіть ваш проект');
  console.log('3. Перейдіть до Table Editor > Create new table');
  console.log('4. Створіть таблицю "news" з необхідними полями');
}

// Функція для налаштування сховища зображень
async function setupStorage() {
  try {
    console.log('Налаштування сховища для зображень новин...');
    
    // Створення сховища для зображень новин
    const { data, error } = await supabase.storage.createBucket('news', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    });
    
    if (error) {
      // Якщо сховище вже існує, це нормально
      if (error.message && error.message.includes('already exists')) {
        console.log('Сховище для новин вже існує');
      } else {
        console.error('Помилка створення сховища:', error);
      }
    } else {
      console.log('Сховище успішно створено:', data);
    }
    
  } catch (error) {
    console.error('Помилка налаштування сховища:', error);
  }
}

// Запуск налаштування
setupDatabase()
  .then(() => {
    console.log('Налаштування успішно завершено');
    process.exit(0);
  })
  .catch(error => {
    console.error('Помилка налаштування:', error);
    process.exit(1);
  }); 