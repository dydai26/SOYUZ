import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/components/ui/use-toast";

const Contacts = () => {
  const { toast } = useToast();
  const [selectedPosition, setSelectedPosition] = useState("");

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would send the form data to a backend
    toast({
      title: "Повідомлення надіслано",
      description: "Дякуємо за ваше звернення! Ми зв'яжемося з вами найближчим часом.",
    });
    // Reset form
    e.currentTarget.reset();
  };

  const handleResumeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would send the resume to a backend
    toast({
      title: "Резюме надіслано",
      description: "Дякуємо за ваше резюме! Ми розглянемо його та зв'яжемося з вами.",
    });
    // Reset form
    e.currentTarget.reset();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f6f2]">
      <Header />
      <main className="flex-1">
        {/* Головний розділ контактів */}
        
        
        {/* Блок контактів з фото як на банері - на всю ширину */}
        <section className="w-full  text-white py-12 mb-0" style={{ backgroundImage: 'url("/fon-blue12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
                <div className="border-t border-white w-[100px] flex-grow max-w-[100px] mr-4"></div>
                <h2 className="text-4xl font-bold text-center border-white whitespace-nowrap">Контакти</h2>
                <div className="border-t border-white w-[100px] flex-grow max-w-[100px] ml-4"></div>
              </div>   
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <h3 className="text-xl mb-4">Офіс менеджер</h3>
                <p className="mb-2">+38067 543 69 71</p>
                <p>info@vyrobnykplyus.com</p>
              </div>
            
              <div className="text-center">
                <h3 className="text-xl mb-4">Відділ контролю якості:</h3>
                <p className="mb-2">+38067 543 69 71</p>
                <p>vp-laboratoria@ukr.net</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl mb-4">Відділ персоналу:</h3>
                <p className="mb-2">+38067 639 25 66</p>
                <p>vurobnykplus@gmail.com</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <h3 className="text-xl mb-4">Керівник відділу ЗЕД (експорт, мережі):</h3>
                <p className="mb-2">+38096 045 30 43</p>
                <p>ksenyya.savchuk@gmail.com</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl mb-4">Керівник відділу продажів Україна:</h3>
                <p className="mb-2">+380679281442</p>
                <p>skovron.a.g@gmail.com</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl mb-4">Керівник відділу продажів Кривий Ріг:</h3>
                <p className="mb-2">+38067 631 11 56</p>
                <p>sedovsv7004@gmail.com</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <h3 className="text-xl mb-4">Керівник відділу закупівель сировини:</h3>
                <p className="mb-2">+38067 558 33 65</p>
                <p>maksimvlasenko7@gmail.com</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl mb-4">Відділ бухгалтерії:</h3>
                <p className="mb-2">+38067 543 69 71</p>
                <p>vurobnykplus@gmail.com</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-8" style={{ backgroundImage: 'url("/fon-white12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Контактна інформація */}
              <div className="space-y-12">
                <div className="flex">
                  <h3 className="text-[#3A3C99] text-2xl font-bold w-1/3">Адреса</h3>
                  <div className="text-[#3A3C99] w-2/3">
                    <p>м. Кривий ріг, вул. Чкалова, 40</p>
                    <p>02000</p>
                  </div>
                </div>
                
                <div className="flex">
                  <h3 className="text-[#3A3C99] text-2xl font-bold w-1/3">Години роботи</h3>
                  <div className="text-[#3A3C99] w-2/3">
                    <p>Понеділок - Субота: 11:00 - 21:00</p>
                    <p>Неділя: 11:00 - 19:00</p>
                  </div>
                </div>
                
                <div className="flex">
                  <h3 className="text-[#3A3C99] text-2xl font-bold w-1/3">Контакти</h3>
                  <div className="text-[#3A3C99] w-2/3">
                    <p>+380 (50) 123-45-67</p>
                    <p>info@vyrobnykplus.com</p>
                  </div>
                </div>
                
                <div className="h-96 w-full overflow-hidden rounded-sm">
                  {/* Google карта */}
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.8988557221283!2d33.39305387656378!3d47.90573847131074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40dadd90c1c88b35%3A0x2a23ed7810d2e50a!2z0LLRg9C7LiDQp9C60LDQu9C-0LLQsCwgNDAsINCa0YDQuNCy0LjQuSDQoNGW0LMsINCU0L3RltC_0YDQvtC_0LXRgtGA0L7QstGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCA1MDAwMA!5e0!3m2!1suk!2sua!4v1699098098099!5m2!1suk!2sua" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              
              {/* Форма зворотного зв'язку */}
              <div className="bg-white p-8 rounded-sm shadow-sm">
                <h2 className="text-[#3A3C99] text-2xl font-bold mb-6">Зв'яжіться з нами</h2>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Input 
                      placeholder="Введіть ваше повне ім'я*" 
                      id="name" 
                      name="name" 
                      className="border-gray-200 rounded-sm p-4 h-8"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input 
                      placeholder="Введіть ваш номер телефону*" 
                      id="phone" 
                      name="phone" 
                      className="border-gray-200 rounded-sm p-4 h-14"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input 
                      placeholder="Введіть вашу електронну пошту*" 
                      id="email" 
                      name="email" 
                      type="email" 
                      className="border-gray-200 rounded-sm p-4 h-14"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="Введіть ваше повідомлення" 
                      id="message" 
                      name="message" 
                      rows={6} 
                      className="border-gray-200 rounded-sm p-4"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-[#3A3C99] hover:bg-[#4A3C90] text-white rounded-sm text-lg transition-colors"
                  >
                    Надіслати запит
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Розділ для надсилання резюме */}
        <section className="py-16 bg-white" style={{ backgroundImage: 'url("/fon-blue12.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="container mx-auto px-4">
            <h2 className="text-white text-3xl font-bold mb-8">
              Приєднуйтесь до нашої команди
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Форма для відправки резюме */}
              <div className=" p-8 rounded-sm shadow-sm">
                <form onSubmit={handleResumeSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Input 
                      placeholder="Ваше ім'я та прізвище*" 
                      id="resume-name" 
                      name="name" 
                      className="border-gray-200 rounded-sm p-4 h-14"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input 
                      placeholder="Ваш номер телефону*" 
                      id="resume-phone" 
                      name="phone" 
                      className="border-gray-200 rounded-sm p-4 h-14"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input 
                      placeholder="Ваша електронна пошта*" 
                      id="resume-email" 
                      name="email" 
                      type="email" 
                      className="border-gray-200 rounded-sm p-4 h-14"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <select 
                      id="position" 
                      name="position" 
                      className="w-full border border-gray-200 rounded-sm p-4 h-14"
                      value={selectedPosition}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      required 
                    >
                      <option value="" disabled>Оберіть відкриту вакансію*</option>
                      <option value="driver">Водій</option>
                      <option value="confectioner">Кондитер</option>
                      <option value="technologist">Технолог кондитер</option>
                      <option value="expeditor">Експедитор</option>
                      <option value="packer">Укладальник пакувальник</option>
                      <option value="quality-specialist">Спеціаліст з якості</option>
                      <option value="storekeeper">Комірник</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative border border-gray-200 rounded-sm p-4 h-14">
                      <input 
                        type="file" 
                        id="resume" 
                        name="resume" 
                        accept=".pdf,.doc,.docx" 
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        required
                      />
                      <div className="flex items-center justify-between text-white">
                        <span>Додати резюме* (PDF, DOC, DOCX)</span>
                        <Upload className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="Розкажіть коротко про себе" 
                      id="cover-letter" 
                      name="coverLetter" 
                      rows={4} 
                      className="border-gray-200 rounded-sm p-4"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-white hover:bg-[#4A3C99] text-[#3A3C99] hover:text-white rounded-sm text-lg transition-colors"
                  >
                    <FileText className="mr-2 h-5 w-5" /> Відправити резюме
                  </Button>
                </form>
              </div>
              
              {/* Зображення фіксованого розміру */}
              <div className="flex items-center justify-center">
                <div className="w-full h-full rounded-sm">
              <img 
                    src="/Команда.jpg" 
                    alt="Виробник Плюс - команда" 
                    className="w-full h-full object-cover rounded-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contacts;
