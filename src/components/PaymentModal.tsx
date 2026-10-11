import React, { useState } from 'react';
import { X, Lock, ShieldCheck, CheckCircle2, AlertCircle, CreditCard, RefreshCw } from 'lucide-react';
import { CardBrand } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (paymentInfo: {
    brand: CardBrand;
    last4: string;
    transactionId: string;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess,
}) => {
  if (!isOpen) return null;

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [is3DSActive, setIs3DSActive] = useState(false);
  const [otpCode, setOtpCode] = useState('7492');
  const [errorMessage, setErrorMessage] = useState('');

  // Detect card brand
  const detectBrand = (num: string): CardBrand => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('9417') || clean.startsWith('5049') || clean.startsWith('9')) {
      return 'elcard';
    }
    if (clean.startsWith('4')) {
      return 'visa';
    }
    if (clean.startsWith('5')) {
      return 'mastercard';
    }
    return 'elcard';
  };

  const currentBrand = detectBrand(cardNumber);

  // Format card number with spaces
  const handleCardNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    setCardNumber(formatted);
    setErrorMessage('');
  };

  // Format expiry MM/YY
  const handleExpiryChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2, 4)}`);
    } else {
      setExpiry(digits);
    }
    setErrorMessage('');
  };

  // Format CVC
  const handleCvcChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 3);
    setCvc(digits);
  };

  // Quick test fill
  const handleQuickFill = (brand: CardBrand) => {
    if (brand === 'elcard') {
      setCardNumber('9417 8820 4519 7382');
      setExpiry('12/28');
      setCvc('884');
      setCardholder('NURBEK ASANKULOV');
    } else if (brand === 'visa') {
      setCardNumber('4111 2222 3333 4444');
      setExpiry('08/29');
      setCvc('421');
      setCardholder('AIDA ALIEVA');
    } else {
      setCardNumber('5105 1051 0510 5100');
      setExpiry('11/27');
      setCvc('312');
      setCardholder('BB PIZZA CLIENT');
    }
    setErrorMessage('');
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 16) {
      setErrorMessage('Введите полный 16-значный номер карты');
      return;
    }
    if (expiry.length < 5) {
      setErrorMessage('Укажите срок действия карты в формате ММ/ГГ');
      return;
    }
    if (cvc.length < 3) {
      setErrorMessage('Укажите 3-значный CVC/CVV код');
      return;
    }
    if (!cardholder.trim()) {
      setErrorMessage('Укажите имя держателя карты');
      return;
    }

    // Begin 3D Secure simulation
    setIsProcessing(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsProcessing(false);
      setIs3DSActive(true);
    }, 1200);
  };

  const handleConfirm3DS = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIs3DSActive(false);
      const cleanNum = cardNumber.replace(/\s+/g, '');
      const last4 = cleanNum.slice(-4) || '7382';
      const txId = `TX-KG-${Math.floor(100000 + Math.random() * 900000)}`;

      onPaymentSuccess({
        brand: currentBrand,
        last4,
        transactionId: txId,
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900">Безопасная оплата картой</h2>
              <div className="text-xs text-stone-500">Шлюз эквайринга · Кыргызстан</div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Отмена оплаты"
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-200/50 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Secure Step vs Card Form Step */}
        {is3DSActive ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                3D-Secure 2.0 Проверка
              </div>
              <h3 className="text-lg font-black text-stone-900 mt-1">
                Подтверждение платежа банком
              </h3>
              <p className="text-xs text-stone-600 mt-1.5 max-w-sm mx-auto">
                Мы отправили проверочный код в SMS на привязанный номер телефона к карте{' '}
                <strong className="text-stone-900">•••• {cardNumber.slice(-4) || '4321'}</strong>.
              </p>
            </div>

            {/* Simulated OTP */}
            <div className="max-w-xs mx-auto space-y-3">
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200">
                <span className="text-xs text-stone-500 block mb-1">Тестовый SMS-код:</span>
                <span className="text-xl font-black tracking-widest text-stone-900 tabular-nums">
                  7492
                </span>
              </div>

              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={4}
                className="w-full text-center py-2.5 px-4 text-lg font-bold tracking-widest rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <button
                type="button"
                onClick={handleConfirm3DS}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Списание средств...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Подтвердить списание {amount} сом</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-stone-400">
              Защищено сертификатом PCI-DSS и НБКР
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-800 font-medium">К оплате онлайн</span>
                <div className="text-xs text-stone-500">Заказ в BB Pizza Bishkek</div>
              </div>
              <div className="text-2xl font-black text-stone-900 tabular-nums">
                {amount} <span className="text-sm font-bold text-amber-700">сом</span>
              </div>
            </div>

            {/* Quick Fill Test Buttons */}
            <div>
              <div className="text-xs font-semibold text-stone-500 mb-2">
                Быстрое заполнение для проверки:
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('elcard')}
                  className="py-1.5 px-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-200 transition-colors cursor-pointer text-center"
                >
                  🇰🇬 Элкарт
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('visa')}
                  className="py-1.5 px-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-200 transition-colors cursor-pointer text-center"
                >
                  Visa Gold
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('mastercard')}
                  className="py-1.5 px-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-200 transition-colors cursor-pointer text-center"
                >
                  Mastercard
                </button>
              </div>
            </div>

            {/* Card Inputs */}
            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span>Номер карты</span>
                  <span className="text-xs font-bold text-amber-700 uppercase">
                    {currentBrand === 'elcard' ? 'Элкарт' : currentBrand.toUpperCase()}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="9417 0000 0000 0000"
                    className="w-full py-2.5 pl-3.5 pr-10 text-sm font-semibold tracking-wider rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <CreditCard className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 mb-1 block">
                    Срок действия
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    placeholder="ММ/ГГ"
                    className="w-full py-2.5 px-3.5 text-sm font-semibold rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-center"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                    <span>CVC / CVV</span>
                    <span className="text-[10px] text-stone-400 font-normal">3 цифры</span>
                  </label>
                  <input
                    type="password"
                    value={cvc}
                    onChange={(e) => handleCvcChange(e.target.value)}
                    placeholder="•••"
                    maxLength={3}
                    className="w-full py-2.5 px-3.5 text-sm font-semibold rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-center tracking-widest"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 block">
                  Имя на карте (латиницей)
                </label>
                <input
                  type="text"
                  value={cardholder}
                  onChange={(e) => setCardholder(e.target.value.toUpperCase())}
                  placeholder="IVAN IVANOV"
                  className="w-full py-2.5 px-3.5 text-sm font-semibold uppercase rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Проверка карты...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Оплатить {amount} сом</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                256-bit SSL
              </span>
              <span>·</span>
              <span>Элкарт / Visa / Mastercard</span>
              <span>·</span>
              <span>Без комиссии</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
