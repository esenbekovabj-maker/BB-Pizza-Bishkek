import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem, CategoryId } from '../types';
import { MENU_ITEMS } from '../data/menu';

interface MenuSectionProps {
  onSelectPizza: (pizza: MenuItem) => void;
  onQuickAdd: (pizza: MenuItem) => void;
  onQuickRemove: (itemId: string) => void;
  getItemQuantity: (itemId: string) => number;
}

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'all', label: 'Все позиции' },
  { id: 'signature', label: 'Фирменные BB' },
  { id: 'meat', label: 'Мясные' },
  { id: 'cheese', label: 'Сырные' },
  { id: 'spicy', label: 'Острые' },
  { id: 'combos', label: 'Комбо сеты' },
  { id: 'drinks', label: 'Напитки' },
];

export const MenuSection: React.FC<MenuSectionProps> = ({
  onSelectPizza,
  onQuickAdd,
  onQuickRemove,
  getItemQuantity,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [halalOnly, setHalalOnly] = useState(false);

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesHalal = halalOnly ? item.isHalal : true;
    return matchesCategory && matchesHalal;
  });

  return (
    <section id="menu" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            Свежевыпеченные шедевры
          </div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            Меню BB Pizza
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-lg">
            Выпекаем из муки мелкого помола Tipo 00. Выберите размер (25/30/35 см),
            добавьте сырный борт или любимые топпинги.
          </p>
        </div>

        {/* Halal Filter Switch */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setHalalOnly(!halalOnly)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              halalOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
            }`}
          >
            {halalOnly ? '✓ Только Халяль' : 'Фильтр: Халяль'}
          </button>
        </div>
      </div>

      {/* Category Tabs (Segmented Control conforming to zero-pill rules) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-10 border-b border-stone-200 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid: 3-column desktop grid with generous whitespace */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => {
          const qty = getItemQuantity(item.id);

          return (
            <article
              key={item.id}
              className={`group flex flex-col bg-white rounded-2xl border transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-lg ${
                qty > 0 ? 'border-amber-400 ring-1 ring-amber-400/50 shadow-sm' : 'border-stone-200'
              }`}
            >
              {/* Image Container with tags & quantity badge */}
              <div
                className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer"
                onClick={() => onSelectPizza(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Single Subtle Tag (Anti-pill compliant) */}
                {item.badge && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-stone-900 bg-white/95 backdrop-blur-md rounded shadow-xs">
                    {item.badge}
                  </div>
                )}

                {/* Quantity Badge on image when in cart */}
                {qty > 0 && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 text-xs font-black text-white bg-stone-900/90 backdrop-blur-md rounded-lg shadow-sm border border-stone-700/50 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="tabular-nums">{qty} в заказе</span>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Clean Metadata: Unboxed text with subtle separators */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                    <span>{item.category === 'combos' ? 'Комбо' : item.category === 'drinks' ? 'Напиток' : 'Пицца'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">от {item.weightGrams['30cm']} г</span>
                    {item.isHalal && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-medium">Халяль</span>
                      </>
                    )}
                  </div>

                  <h3
                    onClick={() => onSelectPizza(item)}
                    className="text-lg font-bold text-stone-900 hover:text-amber-600 transition-colors cursor-pointer"
                  >
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price & Action Module with + and - controls */}
                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-stone-500">от</span>
                    <div className="text-lg font-black text-stone-900 tabular-nums">
                      {item.basePrice} сом
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectPizza(item)}
                      className="px-3 py-2 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Настроить
                    </button>

                    {qty > 0 ? (
                      /* Quantity Stepper with Minus, Quantity, and Plus */
                      <div className="flex items-center gap-1 bg-stone-900 text-white p-1 rounded-lg shadow-xs">
                        <button
                          type="button"
                          onClick={() => onQuickRemove(item.id)}
                          aria-label={`Уменьшить количество ${item.name}`}
                          className="w-7 h-7 rounded-md bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-200 hover:text-white transition-colors cursor-pointer active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <span className="w-6 text-center text-xs font-black tabular-nums text-amber-400">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onQuickAdd(item)}
                          aria-label={`Увеличить количество ${item.name}`}
                          className="w-7 h-7 rounded-md bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-stone-950 transition-colors cursor-pointer active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    ) : (
                      /* Add Button */
                      <button
                        type="button"
                        onClick={() => onQuickAdd(item)}
                        aria-label={`Быстро добавить ${item.name}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>В корзину</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
