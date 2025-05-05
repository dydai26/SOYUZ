
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Реєстрація</h1>
            <p className="mt-2 text-sm text-gray-600">
              Вже маєте акаунт?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Увійти
              </Link>
            </p>
          </div>
          
          <RegisterForm />
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Після реєстрації ми відправимо вам лист для підтвердження електронної адреси.
              <br />
              Якщо ви не бачите лист, перевірте папку "Спам" або використайте опцію повторної відправки.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
