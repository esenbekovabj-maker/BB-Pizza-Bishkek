import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  subtotal: number;
  discount: number;
  onApplyPromo: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  subtotal,
  discount,
  onApplyPromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  if (!isOpen) return null;

  const deliveryThreshold = 500;
  const isFreeDelivery = subtotal >= deliveryThreshold;
  const deliveryCost = items.length === 0 ? 0 : isFreeDelivery ? 0 : 70;
  const finalTotal = Math.max(0, subtotal - discount + deliveryCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromo(promoInput.trim());
    if (success) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Промокод недействителен (попробуйте BBPIZZA или BISHKEK)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-black text-stone-900">Ваша корзина</h2>
            <span className="text-xs text-stone-500 font-semibold tabular-nums">
              ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Закрыть корзину"
            className="w-8 h-8 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        {items.length > 0 && (
          <div className="px-5 py-2.5 bg-amber-50/70 border-b border-amber-100 text-xs">
            {isFreeDelivery ? (
              <span className="text-emerald-800 font-semibold">
                ✓ Бесплатная доставка по Бишкеку активирована!
              </span>
            ) : (
              <span className="text-stone-700">
                До бесплатной доставки не хватает{' '}
                <strong className="text-amber-700 tabular-nums">
                  {deliveryThreshold - subtotal} сом
                </strong>
              </span>
            )}
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <ShoppingBag className="w-12 h-12 stroke-[1.5] text-stone-300 mb-3" />
              <div className="text-base font-bold text-stone-800">Корзина пуста</div>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Выберите пиццу в меню, настройте тесто и любимые топпинги
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 text-xs font-bold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                Перейти в меню
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="p-3.5 rounded-xl border border-stone-200 bg-white flex gap-3.5 relative"
              >
                {/* Thumbnail */}
                <div className="w-18 h-18 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-stone-900 truncate">
                      {item.menuItem.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartItemId)}
                      aria-label="Удалить"
                      className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-stone-500 mt-0.5 space-y-0.5">
                    <div>
                      {item.size === '25cm' ? '25 см (Стандарт)' : item.size === '30cm' ? '30 см (Средняя)' : '35 см (Большая)'}
                      {item.crust === 'cheese_crust' && ' · Сырный борт'}
                    </div>
                    {item.addedToppings.length > 0 && (
                      <div className="text-amber-800 text-[11px] truncate">
                        +{item.addedToppings.map((t) => t.name).join(', ')}
                      </div>
                    )}
                    {item.removedIngredients.length > 0 && (
                      <div className="text-stone-400 text-[11px] line-through truncate">
                        Без: {item.removedIngredients.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Quantity & Unit price */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5 bg-stone-100 rounded-md p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-sm font-black text-stone-900 tabular-nums">
                      {item.totalPrice} сом
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo code & Footer summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Промокод (напр. BBPIZZA)"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value.toUpperCase());
                    setPromoError('');
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase font-semibold"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-bold text-stone-800 bg-white border border-stone-300 hover:border-stone-400 rounded-lg cursor-pointer transition-colors"
              >
                Применить
              </button>
            </form>
            {promoApplied && (
              <div className="text-xs text-emerald-700 font-semibold">
                ✓ Скидка 10% успешно применена!
              </div>
            )}
            {promoError && (
              <div className="text-xs text-red-600">{promoError}</div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>Сумма заказа:</span>
                <span className="tabular-nums font-semibold">{subtotal} сом</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Скидка по промокоду:</span>
                  <span className="tabular-nums">-{discount} сом</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Доставка по Бишкеку:</span>
                <span className="tabular-nums font-semibold">
                  {deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} сом`}
                </span>
              </div>
              <div className="h-px bg-stone-200 my-1" />
              <div className="flex justify-between text-sm font-black text-stone-900">
                <span>К оплате:</span>
                <span className="tabular-nums text-base">{finalTotal} сом</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Перейти к оформлению</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
