import React from 'react';
import { X, MapPin, Clock, ShieldCheck, Zap } from 'lucide-react';
import { BISHKEK_DISTRICTS, BB_KITCHEN_LOCATION } from '../data/bishkekDistricts';

interface DeliveryZonesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryZonesModal: React.FC<DeliveryZonesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-lg font-black text-stone-900">Зоны доставки BB Pizza в Бишкеке</h2>
              <div className="text-xs text-stone-500">
                Кухня: {BB_KITCHEN_LOCATION.name}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="w-8 h-8 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Rules strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800">Зеленая зона (Центр)</div>
              <div className="text-sm font-black text-emerald-900 mt-0.5">Бесплатно от 500 сом</div>
              <div className="text-xs text-emerald-700 mt-1">25-30 минут доставки</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-xs font-bold text-amber-800">Желтая зона (Микрорайоны)</div>
              <div className="text-sm font-black text-amber-900 mt-0.5">Бесплатно от 700 сом</div>
              <div className="text-xs text-amber-700 mt-1">30-35 минут (Джал, Асанбай, 7 мкр)</div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
              <div className="text-xs font-bold text-orange-800">Оранжевая зона</div>
              <div className="text-sm font-black text-orange-900 mt-0.5">До 40 минут</div>
              <div className="text-xs text-orange-700 mt-1">Кызыл-Аскер, Жибек Жолу</div>
            </div>
          </div>

          {/* Districts table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Список охватываемых микрорайонов
            </h3>

            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-white text-xs">
              {BISHKEK_DISTRICTS.map((d) => (
                <div key={d.id} className="p-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-stone-900">{d.name}</div>
                    <div className="text-stone-500 mt-0.5">{d.description}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-stone-900 tabular-nums">
                      ~{d.deliveryTimeMin} мин
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {d.deliveryCostSom === 0 ? 'Бесплатно' : `${d.deliveryCostSom} сом`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee banner */}
          <div className="p-4 rounded-xl bg-stone-900 text-stone-100 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-white text-sm">Гарантия горячей пиццы: 65°C</div>
              <p className="text-stone-300 mt-0.5">
                Каждый курьер оснащен профессиональной термосумкой с подогревом. Если пицца
                приедет остывшей, мы подарим промокод на бесплатную большую пиццу!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
