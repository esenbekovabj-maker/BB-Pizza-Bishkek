import React from 'react';
import { Phone, Clock, MapPin, Instagram, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="about" className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-black text-white">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-600 text-white font-black text-lg">
                BB
              </span>
              <span>PIZZA</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Пекарня горячей неаполитанской и авторской пиццы в сердце Бишкека. Итальянская мука Tipo 00,
              48 часов созревания теста и фермерские ингредиенты Кыргызстана.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Халяль сертификация · Стандарт качества</span>
            </div>
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Контакты пекарни
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>г. Бишкек, пер. Геологический, 3</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:+996555312312" className="hover:text-white transition-colors">
                  +996 (555) 312-312
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Ежедневно 10:00 — 02:00</span>
              </div>
            </div>
          </div>

          {/* Bishkek Delivery Info */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Доставка в Бишкеке
            </div>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>· Центр, Восток-5, Джал, Асанбай</li>
              <li>· Экспресс-доставка от 25 минут</li>
              <li>· Бесплатно при заказе от 500 сом</li>
              <li>· Термосумки с постоянным подогревом 65°C</li>
            </ul>
          </div>

          {/* Payments & Security */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Способы оплаты онлайн
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-stone-800 rounded font-semibold text-stone-200 border border-stone-700">
                🇰🇬 Элкарт
              </span>
              <span className="px-2.5 py-1 bg-stone-800 rounded font-semibold text-stone-200 border border-stone-700">
                Visa
              </span>
              <span className="px-2.5 py-1 bg-stone-800 rounded font-semibold text-stone-200 border border-stone-700">
                Mastercard
              </span>
              <span className="px-2.5 py-1 bg-stone-800 rounded font-semibold text-stone-200 border border-stone-700">
                MBank QR
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-snug">
              Все онлайн-платежи защищены 256-битным шифрованием по международным стандартам безопасности PCI-DSS.
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 BB Pizza Bishkek. Все права защищены.
          </div>
          <div className="flex items-center gap-4">
            <a href="#menu" className="hover:text-stone-300 transition-colors">
              Меню
            </a>
            <a href="#about" className="hover:text-stone-300 transition-colors">
              О нас
            </a>
            <span>Бишкек, Кыргызстан</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
