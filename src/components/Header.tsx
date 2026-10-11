import React from 'react';
import { ShoppingBag, Flame } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onNavigateSection: (sectionId: string) => void;
  hasActiveOrder: boolean;
  onOpenTracker: () => void;
  onOpenZones: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onNavigateSection,
  hasActiveOrder,
  onOpenTracker,
  onOpenZones,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-2xl font-black tracking-tight text-stone-900 whitespace-nowrap shrink-0"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-600 text-white font-black text-xl shadow-sm">
            BB
          </span>
          <span className="font-extrabold text-stone-900">PIZZA</span>
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigateSection('menu')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Меню
          </button>
          <button
            onClick={() => onNavigateSection('about')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            О пекарне
          </button>
          <button
            onClick={onOpenZones}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Зоны доставки
          </button>
          <button
            onClick={onOpenTracker}
            className="relative hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Отследить заказ</span>
            {hasActiveOrder && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {hasActiveOrder && (
            <button
              onClick={onOpenTracker}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
              <span>Заказ в пути</span>
            </button>
          )}

          <button
            onClick={onOpenCart}
            aria-label="Открыть корзину"
            className="inline-flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>
              {cartCount > 0 ? (
                <>
                  Корзина · <span className="tabular-nums font-bold">{cartTotal} сом</span>
                </>
              ) : (
                'Корзина'
              )}
            </span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-amber-500 text-stone-950 rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
