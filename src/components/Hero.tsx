import React from 'react';
import { ArrowDown, ShieldCheck, Clock, Flame, CreditCard } from 'lucide-react';
import heroPizzaImg from '../assets/images/hero_bb_crispy_pizza_1791722246313.jpg';

interface HeroProps {
  onScrollToMenu: () => void;
  onOpenTracker: () => void;
  hasActiveOrder: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToMenu,
  onOpenTracker,
  hasActiveOrder,
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100 pt-8 pb-14 lg:py-20">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial from-amber-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography & Intent */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase">
              <span>Бишкек</span>
              <span aria-hidden="true">·</span>
              <span>пер. Геологический, 3</span>
              <span aria-hidden="true">·</span>
              <span>48 часов ферментации</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight lg:leading-tight">
              Горячая неаполитанская пицца в Бишкеке
            </h1>

            <p className="text-base sm:text-lg text-stone-300 max-w-xl font-normal leading-relaxed">
              Выпекаем при 380°C по авторским итальянским рецептам. Тянущаяся фермерская моцарелла,
              хрустящий пышный бортик и моментальная доставка до двери с живой картой курьера.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScrollToMenu}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <span>Выбрать в меню</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenTracker}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors cursor-pointer"
              >
                <span>{hasActiveOrder ? 'Где мой курьер?' : 'Отследить заказ'}</span>
              </button>
            </div>

            {/* Payment & Trust Trustmarks */}
            <div className="pt-2 flex items-center gap-3 text-xs text-stone-400">
              <span className="text-stone-300 font-medium">Принимаем к оплате:</span>
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-200 font-semibold border border-stone-700">Элкарт</span>
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-200 font-semibold border border-stone-700">Visa</span>
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-200 font-semibold border border-stone-700">Mastercard</span>
              <span className="text-stone-400">· MBank QR</span>
            </div>
          </div>

          {/* Right Column: Hero Media Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-square border border-stone-800 shadow-2xl bg-stone-950">
              <img
                src={heroPizzaImg}
                alt="BB Pizza Bishkek свежевыпеченная пицца из печи"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Highlight Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-800 flex items-center justify-between text-left">
                <div>
                  <div className="text-xs text-amber-400 font-medium">Фирменный стандарт BB</div>
                  <div className="text-sm font-bold text-white">Доставка в термосумке за 30-40 мин</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400">от</span>
                  <div className="text-lg font-extrabold text-amber-400 tabular-nums">480 сом</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Feature Strip */}
        <div className="mt-14 pt-8 border-t border-stone-800 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 border border-stone-700 text-amber-400 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Горячая печь 380°C</div>
              <div className="text-xs text-stone-400 mt-0.5">Выпекаем свежую за 90 секунд</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 border border-stone-700 text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">30–40 мин доставка</div>
              <div className="text-xs text-stone-400 mt-0.5">По всем районам Бишкека</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 border border-stone-700 text-amber-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Оплата онлайн</div>
              <div className="text-xs text-stone-400 mt-0.5">Элкарт, Visa, Mastercard, MBank</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 border border-stone-700 text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Халяль стандарт</div>
              <div className="text-xs text-stone-400 mt-0.5">Только свежее местное мясо</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
