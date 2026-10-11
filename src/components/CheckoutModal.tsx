import React, { useState } from 'react';
import { X, MapPin, Phone, User, CreditCard, QrCode, Banknote, ShieldAlert } from 'lucide-react';
import { OrderCustomer, PaymentMethod, CartItem } from '../types';
import { BISHKEK_DISTRICTS } from '../data/bishkekDistricts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  onStartPayment: (customer: OrderCustomer, method: PaymentMethod, deliveryFee: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  onStartPayment,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+996 ');
  const [districtId, setDistrictId] = useState(BISHKEK_DISTRICTS[0].id);
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');
  const [intercom, setIntercom] = useState('');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedDistrict = BISHKEK_DISTRICTS.find((d) => d.id === districtId) || BISHKEK_DISTRICTS[0];
  const deliveryFee = subtotal >= 500 ? 0 : selectedDistrict.deliveryCostSom;
  const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Пожалуйста, укажите ваше имя');
      return;
    }
    if (phone.trim().length < 10) {
      setErrorMsg('Пожалуйста, укажите контактный номер телефона');
      return;
    }
    if (!street.trim()) {
      setErrorMsg('Укажите улицу и номер дома в Бишкеке');
      return;
    }

    setErrorMsg('');
    const customer: OrderCustomer = {
      name: name.trim(),
      phone: phone.trim(),
      district: selectedDistrict.name,
      street: street.trim(),
      apartment: apartment.trim(),
      entrance: entrance.trim(),
      floor: floor.trim(),
      intercom: intercom.trim(),
      comment: comment.trim(),
    };

    onStartPayment(customer, paymentMethod, deliveryFee);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-stone-900">Оформление доставки в Бишкеке</h2>
            <div className="text-xs text-stone-500">Заполните адрес и выберите способ оплаты</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="w-8 h-8 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              1. Контактные данные
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  Ваше имя *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Азамат"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2.5 px-3.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  Номер телефона (Кыргызстан) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+996 555 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-2.5 px-3.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              2. Адрес доставки в Бишкеке
            </h3>

            <div>
              <label className="text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                Район / микрорайон *
              </label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full py-2.5 px-3 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {BISHKEK_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.deliveryTimeMin} мин ({d.deliveryCostSom === 0 ? 'Бесплатно' : `${d.deliveryCostSom} сом`})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 mt-1">
                {selectedDistrict.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label className="text-xs font-bold text-stone-700 mb-1 block">
                  Улица и номер дома *
                </label>
                <input
                  type="text"
                  required
                  placeholder="пр. Чуй, 114 или ул. Киевская, 45"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full py-2.5 px-3.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-xs font-bold text-stone-700 mb-1 block">
                  Квартира / офис
                </label>
                <input
                  type="text"
                  placeholder="кв. 18"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full py-2.5 px-3.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 block">
                  Подъезд
                </label>
                <input
                  type="text"
                  placeholder="1"
                  value={entrance}
                  onChange={(e) => setEntrance(e.target.value)}
                  className="w-full py-2 px-3 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 block">
                  Этаж
                </label>
                <input
                  type="text"
                  placeholder="4"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full py-2 px-3 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 block">
                  Домофон
                </label>
                <input
                  type="text"
                  placeholder="18B"
                  value={intercom}
                  onChange={(e) => setIntercom(e.target.value)}
                  className="w-full py-2 px-3 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 mb-1 block">
                Примечание для курьера
              </label>
              <input
                type="text"
                placeholder="Оставить у двери / позвонить за 5 минут"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full py-2.5 px-3.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              3. Способ оплаты
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-stone-900'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-100/80 px-1.5 py-0.5 rounded">
                    Онлайн
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-bold">Картой онлайн</div>
                  <div className="text-xs text-stone-500">Элкарт, Visa, MC</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('mbank')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'mbank'
                    ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-stone-900'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <QrCode className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold text-stone-600 uppercase bg-stone-100 px-1.5 py-0.5 rounded">
                    QR
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-bold">MBank / Optima</div>
                  <div className="text-xs text-stone-500">Оплата по QR-коду</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'cash'
                    ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-stone-900'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Banknote className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold text-stone-600 uppercase bg-stone-100 px-1.5 py-0.5 rounded">
                    Курьеру
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-bold">При получении</div>
                  <div className="text-xs text-stone-500">Наличные / Терминал</div>
                </div>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-between cursor-pointer"
            >
              <span>
                {paymentMethod === 'card'
                  ? 'Перейти к оплате картой'
                  : 'Подтвердить заказ'}
              </span>
              <span className="tabular-nums text-lg font-black">{totalAmount} сом</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
