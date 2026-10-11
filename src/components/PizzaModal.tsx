import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { MenuItem, PizzaSize, CrustType, ExtraTopping } from '../types';
import { EXTRA_TOPPINGS } from '../data/menu';

interface PizzaModalProps {
  pizza: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (params: {
    menuItem: MenuItem;
    size: PizzaSize;
    crust: CrustType;
    addedToppings: ExtraTopping[];
    removedIngredients: string[];
    quantity: number;
    unitPrice: number;
  }) => void;
}

export const PizzaModal: React.FC<PizzaModalProps> = ({
  pizza,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !pizza) return null;

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('30cm');
  const [selectedCrust, setSelectedCrust] = useState<CrustType>('traditional');
  const [selectedToppings, setSelectedToppings] = useState<ExtraTopping[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Price calculations
  const crustPrice = selectedCrust === 'cheese_crust' ? 120 : 0;
  const toppingsPrice = selectedToppings.reduce((acc, t) => acc + t.price, 0);
  const sizePrice = pizza.sizePrices[selectedSize];
  const unitPrice = sizePrice + crustPrice + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (topping: ExtraTopping) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const toggleRemoveIngredient = (ingredient: string) => {
    if (removedIngredients.includes(ingredient)) {
      setRemovedIngredients(removedIngredients.filter((i) => i !== ingredient));
    } else {
      setRemovedIngredients([...removedIngredients, ingredient]);
    }
  };

  const handleAdd = () => {
    onAddToCart({
      menuItem: pizza,
      size: selectedSize,
      crust: selectedCrust,
      addedToppings: selectedToppings,
      removedIngredients,
      quantity,
      unitPrice,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 flex items-center justify-center shadow-sm cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Header & Image */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-5 relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-100 border border-stone-200">
              <img
                src={pizza.image}
                alt={pizza.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-7 space-y-2">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>{pizza.category === 'spicy' ? 'Острая пицца' : 'Авторская пицца'}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{pizza.weightGrams[selectedSize]} г</span>
                {pizza.isHalal && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-medium">Халяль</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-black text-stone-900">{pizza.name}</h2>
              <p className="text-sm text-stone-600 leading-relaxed">{pizza.description}</p>
            </div>
          </div>

          <div className="h-px bg-stone-200" />

          {/* Size Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Размер пиццы
            </label>
            <div className="grid grid-cols-3 gap-2.5 p-1 bg-stone-100 rounded-xl">
              {(
                [
                  { key: '25cm', label: '25 см', sub: 'Стандарт' },
                  { key: '30cm', label: '30 см', sub: 'Средняя' },
                  { key: '35cm', label: '35 см', sub: 'Большая' },
                ] as const
              ).map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSelectedSize(s.key)}
                  className={`py-2.5 px-3 rounded-lg text-center transition-all cursor-pointer ${
                    selectedSize === s.key
                      ? 'bg-white text-stone-900 shadow-sm font-bold'
                      : 'text-stone-600 hover:text-stone-900 font-medium'
                  }`}
                >
                  <div className="text-sm">{s.label}</div>
                  <div className="text-xs text-stone-500 tabular-nums">
                    {pizza.sizePrices[s.key]} сом
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Crust Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Тесто и бортик
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { key: 'traditional', label: 'Традиционное', price: '0 сом', desc: 'Пышный бортик' },
                { key: 'thin', label: 'Тонкое', price: '0 сом', desc: 'Итальянский хруст' },
                { key: 'cheese_crust', label: 'Сырный борт', price: '+120 сом', desc: 'Моцарелла внутри' },
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setSelectedCrust(c.key as CrustType)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedCrust === c.key
                      ? 'border-amber-500 bg-amber-50/50 text-stone-900 ring-1 ring-amber-500'
                      : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{c.label}</span>
                    <span className="text-xs font-medium text-stone-500 tabular-nums">{c.price}</span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Extra Toppings */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Добавить в пиццу (топпинги)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EXTRA_TOPPINGS.map((top) => {
                const isSelected = selectedToppings.some((t) => t.id === top.id);
                return (
                  <button
                    key={top.id}
                    type="button"
                    onClick={() => toggleTopping(top)}
                    className={`p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 text-stone-900 font-semibold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="truncate">
                      <div className="text-xs font-medium truncate">{top.name}</div>
                      <div className="text-xs text-stone-500 tabular-nums">+{top.price} сом</div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exclude ingredients */}
          {pizza.ingredients.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Убрать ингредиент (если аллергия или предпочтение)
              </label>
              <div className="flex flex-wrap gap-2">
                {pizza.ingredients.map((ing) => {
                  const isRemoved = removedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => toggleRemoveIngredient(ing)}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer border ${
                        isRemoved
                          ? 'bg-red-50 text-red-700 border-red-200 line-through'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {isRemoved ? `Без: ${ing}` : ing}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          {/* Quantity stepper */}
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded flex items-center justify-center text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold tabular-nums text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-between cursor-pointer"
          >
            <span>В корзину</span>
            <span className="tabular-nums font-black text-base">{totalPrice} сом</span>
          </button>
        </div>
      </div>
    </div>
  );
};
