import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12" style={{ backgroundImage: 'url("/fon-white12.png")', backgroundSize: 'contain', backgroundPosition: 'center' }}>
        <div className="container">
          <div className="flex items-center justify-center mb-12">
            <div className="border-t border-[#3A3C99] w-[100px] flex-grow max-w-[100px] mr-4"></div>
            <h2 className="text-4xl font-bold text-center text-[#3A3C99] whitespace-nowrap">Про нас</h2>
            <div className="border-t border-[#3A3C99] w-[100px] flex-grow max-w-[100px] ml-4"></div>
          </div>   
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-semibold mb-4 text-[#3A3C99]">Наша історія</h2>
              <p className=" mb-4 text-[#3A3C99] text-lg">
              Компанія ТОВ Виробник Плюс виникла на базі колишнього хлібзаводу у місті Кривий Ріг понад 15 років тому. 
              Її історія почалася з скромних початків, але завдяки наполегливості та професіоналізму засновників, швидко стала визнаним лідером у виробництві кондитерських виробів. Використовуючи сучасні технології та інновації, компанія зберігає традиції якості та надійності.
              </p>
              <p className=" mb-4 text-[#3A3C99] text-lg">
              Весь асортимент продукції ТМ SOYUZ KONDITER, який виготовляється компанією 
              ТОВ Виробник Плюс, включаючи вівсяне печиво, кукурудзяне печиво, сухарі, торти та тістечка 
              має українське походження. Більшість інгредієнтів, які використовуються у виробництві, також є здобутими на українських землях. Це відображає нашу глибоку зв'язаність з країною та підтримку вітчизняних виробників. Така практика не лише сприяє розвитку внутрішнього ринку та
               підтримці місцевих виробників, але й гарантує високу якість нашої продукції.
              </p>
              <p className=" text-[#3A3C99] text-lg">
              Лозунг компанії Разом смачніше відображає нашу філософію та цінності, спрямовані на співпрацю та партнерство. Він підкреслює наше переконання у тому, що спільна праця та об'єднання зусиль приносять кращі результати, ніж індивідуальні зусилля. Ми віримо, що колективна мудрість та спільна творчість дозволяють нам досягати вищих стандартів якості та надавати нашим клієнтам найсмачніші та найвишуканіші продукти.
              </p>
            </div>
            <div>
              <img 
                src="/історія.jpg" 
                alt="Історія компанії" 
                className="rounded-lg shadow-md w-full h-auto"
              />
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-center text-[#3A3C99]">Наша місія</h2>
            <div className="max-w-3xl mx-auto text-justify">
              <p className="text-xl text-[#3A3C99] italic">
                "Наша місія - перетворювати моменти задоволення у незабутні враження, створюючи найсмачніші кондитерські вироби під брендом ТМ 'SOYUZ KONDITER'. Ми прагнемо принести задоволення та радість кожному клієнту, завдяки використанню українських інгредієнтів у нашій продукції та нашій відданості якості та смаку.

Наші цінності втілені в кожній крихті нашої продукції. Ми прагнемо до постійного удосконалення, використовуючи лише найякісніші інгредієнти та технології виробництва. Наша відданість якості, інноваціям та підтримці місцевих виробників визначає нашу компанію і відображається в кожному нашому продукті."
              </p>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-[#3A3C99]">Наше виробництво</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[#3A3C99] mb-4">
                  Виробництво VYROBNYKPLUS оснащене сучасним обладнанням від провідних 
                  європейських виробників. Ми суворо дотримуємося всіх санітарних норм 
                  та стандартів якості.
                </p>
                <p className="text-[#3A3C99]">
                  Наші технологи постійно працюють над вдосконаленням рецептур та 
                  розробкою нових видів продукції. Ми використовуємо лише натуральні 
                  інгредієнти та не застосовуємо консерванти.
                </p>
              </div>
              <div>
                <p className="text-[#3A3C99] mb-4">
                  Контроль якості здійснюється на всіх етапах виробництва: від перевірки 
                  сировини до дегустації готової продукції. Наша лабораторія проводить 
                  регулярні тестування, щоб гарантувати безпеку та якість кожної партії.
                </p>
                <p className="text-[#3A3C99]">
                  Завдяки цьому підходу, продукція VYROBNYKPLUS відповідає найвищим 
                  стандартам якості та має відмінні смакові характеристики.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className=" p-6 rounded-lg" style={{ backgroundImage: 'url("/fon-blue12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <h3 className="text-xl  mb-3 text-white">Сертифікація</h3>
              <p className="text-white">
                Уся наша продукція сертифікована згідно з українським законодавством 
                та відповідає міжнародним стандартам якості ISO 9001.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg" style={{ backgroundImage: 'url("/fon-blue12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <h3 className="text-xl text-white mb-3">Екологічність</h3>
              <p className="text-white">
                Ми дбаємо про навколишнє середовище, використовуючи енергоефективне 
                обладнання та екологічно чисті матеріали для упаковки.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg" style={{ backgroundImage: 'url("/fon-blue12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <h3 className="text-xl text-white mb-3">Соціальна відповідальність</h3>
              <p className="text-white">
                VYROBNYKPLUS регулярно підтримує соціальні проекти та благодійні організації, 
                допомагаючи дитячим будинкам та школам.
              </p>
            </div>
          </div>
          
          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
