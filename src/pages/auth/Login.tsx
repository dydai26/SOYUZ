
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Вхід</h1>
            <p className="mt-2 text-sm text-gray-600">
              Немає акаунту?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Зареєструватися
              </Link>
            </p>
          </div>
          
          <LoginForm />
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Після реєстрації вам потрібно підтвердити електронну адресу.
              Якщо ви не отримали лист, перевірте папку "Спам".
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
