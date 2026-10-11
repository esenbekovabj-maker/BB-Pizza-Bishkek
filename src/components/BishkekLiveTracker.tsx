import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle2,
  Flame,
  ChefHat,
  Bike,
  PackageCheck,
  Compass,
  Zap,
  Navigation,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { BB_KITCHEN_LOCATION, BISHKEK_DISTRICTS } from '../data/bishkekDistricts';

interface BishkekLiveTrackerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
  onSeedDemoOrder: () => void;
}

export const BishkekLiveTracker: React.FC<BishkekLiveTrackerProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateOrderStatus,
  onSeedDemoOrder,
}) => {
  if (!isOpen) return null;

  // Real-time animation states
  const [courierProgress, setCourierProgress] = useState(order?.progressPercent || 35);
  const [simulationSpeed, setSimulationSpeed] = useState<1 | 3 | 10>(1);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Determine current destination coords
  const targetDistrict = BISHKEK_DISTRICTS.find(
    (d) => order && d.name.includes(order.customer.district)
  ) || BISHKEK_DISTRICTS[3]; // Asanbay default for nice long route

  const startX = BB_KITCHEN_LOCATION.coords.x; // 51
  const startY = BB_KITCHEN_LOCATION.coords.y; // 48
  const endX = targetDistrict.coords.x;
  const endY = targetDistrict.coords.y;

  // Waypoints in Bishkek road grid (e.g., turn down Manas or Sovietskaya)
  // intermediate waypoint (Toktogula -> Soviet/Baitik Baatyra -> destination)
  const midX = endX > startX ? 60 : 42;
  const midY = startY;

  // Calculate current courier coordinate based on progress
  let currentCourierX = startX;
  let currentCourierY = startY;

  const t = courierProgress / 100;
  if (t < 0.3) {
    // Stage 1: Along Toktogula/Kievskaya
    const localT = t / 0.3;
    currentCourierX = startX + (midX - startX) * localT;
    currentCourierY = startY;
  } else {
    // Stage 2: Down Baitik Baatyra / Ch. Aitmatova to district
    const localT = (t - 0.3) / 0.7;
    currentCourierX = midX + (endX - midX) * localT;
    currentCourierY = midY + (endY - midY) * localT;
  }

  // Derive street name
  const currentStreetName =
    courierProgress < 20
      ? 'пер. Геологический, 3 / ул. Ибраимова'
      : courierProgress < 40
      ? 'ул. Байтик Баатыра / ул. Горького'
      : courierProgress < 70
      ? 'ул. Байтик Баатыра / ул. Ахунбаева'
      : courierProgress < 95
      ? 'ул. Юнусалиева / мкр. Асанбай'
      : order?.customer.street || 'Подъезд к адресу клиента';

  // Live simulation tick
  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      setCourierProgress((prev) => {
        if (prev >= 100) return 100;
        const next = Math.min(100, prev + 0.5 * simulationSpeed);
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [order, simulationSpeed]);

  // Derived current status based on progress
  const activeStatus: OrderStatus =
    courierProgress < 15
      ? 'confirmed'
      : courierProgress < 35
      ? 'preparing'
      : courierProgress < 55
      ? 'baking'
      : courierProgress < 99
      ? 'on_the_way'
      : 'delivered';

  const remainingMinutes = Math.max(
    1,
    Math.round(28 * (1 - courierProgress / 100))
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const jumpToStage = (stageProgress: number) => {
    setCourierProgress(stageProgress);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[96vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-lg shadow-sm">
              BB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">
                  Живой трекинг доставки · Бишкек
                </h2>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-400/30">
                  {order ? order.id : 'ДЕМО-ТРЕКЕР'}
                </span>
              </div>
              <div className="text-xs text-stone-400">
                GPS позиция курьера обновляется каждые 3 секунды
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareSuccess ? 'Скопировано!' : 'Поделиться'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Закрыть трекер"
              className="w-9 h-9 rounded-lg bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If no order exists, show Quick Demo launcher */}
        {!order ? (
          <div className="p-12 text-center space-y-4 max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Bike className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              У вас пока нет активных заказов
            </h3>
            <p className="text-sm text-stone-600">
              Сделайте заказ в меню с оплатой картой или запустите интерактивный демо-заказ,
              чтобы прямо сейчас посмотреть, как работает карта Бишкека и перемещение курьера!
            </p>
            <button
              type="button"
              onClick={onSeedDemoOrder}
              className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Запустить демо-заказ с курьером в Бишкеке
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Split Layout: Map on left/top, Status Details on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              {/* Map Panel (7 cols on lg) */}
              <div className="lg:col-span-7 bg-stone-100 relative min-h-[360px] sm:min-h-[440px] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200">
                {/* Real-time Map HUD Overlay (Top) */}
                <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                  <div className="p-2.5 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-stone-200 text-xs pointer-events-auto flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-amber-600 animate-spin" />
                    <div>
                      <div className="font-bold text-stone-900 truncate max-w-[200px]">
                        {currentStreetName}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Скорость ~34 км/ч · Сумка 65°C
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900/90 text-white backdrop-blur-md shadow-md text-xs pointer-events-auto flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <div className="tabular-nums font-black text-amber-400 text-sm">
                      {activeStatus === 'delivered' ? '0 мин' : `~${remainingMinutes} мин`}
                    </div>
                  </div>
                </div>

                {/* Bishkek Vector Map SVG */}
                <div className="relative w-full h-full flex-1 overflow-hidden select-none bg-[#f4f2ee]">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full object-cover"
                    preserveAspectRatio="none"
                  >
                    {/* Background Map Blocks */}
                    <rect width="100" height="100" fill="#f5f2eb" />

                    {/* Parks & Greenery in Bishkek */}
                    {/* Ala-Archa / Botanical garden south */}
                    <rect x="58" y="70" width="14" height="16" rx="1.5" fill="#e2ecd8" />
                    <text x="65" y="79" fontSize="2.2" fill="#588157" textAnchor="middle" fontWeight="bold">
                      Ботанический сад
                    </text>

                    {/* Panfilov Park */}
                    <rect x="42" y="44" width="7" height="6" rx="1" fill="#e2ecd8" />
                    <text x="45.5" y="48" fontSize="1.8" fill="#588157" textAnchor="middle">
                      Парк Панфилова
                    </text>

                    {/* Karagachevaya Rosha North */}
                    <rect x="52" y="14" width="18" height="10" rx="2" fill="#e2ecd8" />
                    <text x="61" y="20" fontSize="2.2" fill="#588157" textAnchor="middle">
                      Карагачевая роща
                    </text>

                    {/* Major Bishkek East-West Avenues (Horizontal) */}
                    {/* Zhibek Zholu (North) */}
                    <line x1="0" y1="28" x2="100" y2="28" stroke="#d5cebe" strokeWidth="2.8" />
                    <text x="12" y="27" fontSize="2.1" fill="#8d8474" fontWeight="600">
                      пр. Жибек Жолу
                    </text>

                    {/* Chuy Avenue (Center main artery) */}
                    <line x1="0" y1="44" x2="100" y2="44" stroke="#d1c7b3" strokeWidth="3.4" />
                    <text x="12" y="43" fontSize="2.2" fill="#786e5e" fontWeight="700">
                      проспект Чуй
                    </text>

                    {/* Kievskaya St */}
                    <line x1="15" y1="47" x2="90" y2="47" stroke="#ded8ca" strokeWidth="1.4" />

                    {/* Toktogula St (Location of BB Pizza Hub) */}
                    <line x1="15" y1="50" x2="88" y2="50" stroke="#d8d1c1" strokeWidth="1.8" />
                    <text x="24" y="49.3" fontSize="1.8" fill="#8c8272">
                      ул. Токтогула
                    </text>

                    {/* Moskovskaya St */}
                    <line x1="15" y1="53" x2="88" y2="53" stroke="#ded8ca" strokeWidth="1.4" />

                    {/* Bokonbaeva St */}
                    <line x1="15" y1="57" x2="88" y2="57" stroke="#ded8ca" strokeWidth="1.4" />

                    {/* Akhunbaeva St */}
                    <line x1="10" y1="67" x2="95" y2="67" stroke="#d5cebe" strokeWidth="2.4" />
                    <text x="14" y="66" fontSize="2.1" fill="#8d8474" fontWeight="600">
                      ул. Ахунбаева
                    </text>

                    {/* South Magistral (Tokombaeva) */}
                    <line x1="20" y1="84" x2="95" y2="84" stroke="#d1c7b3" strokeWidth="3" />
                    <text x="35" y="83" fontSize="2.2" fill="#786e5e" fontWeight="700">
                      Южная Магистраль (Аалы Токомбаева)
                    </text>

                    {/* Major Bishkek North-South Arteries (Vertical) */}
                    {/* Fuchika / Western */}
                    <line x1="18" y1="20" x2="18" y2="65" stroke="#d5cebe" strokeWidth="2" />
                    <text x="19" y="34" fontSize="1.8" fill="#8d8474" transform="rotate(90 19 34)">
                      ул. Фучика
                    </text>

                    {/* Manas / Ch. Aitmatov Ave */}
                    <line x1="38" y1="20" x2="38" y2="90" stroke="#d1c7b3" strokeWidth="3" />
                    <text x="39" y="36" fontSize="2.1" fill="#786e5e" fontWeight="700" transform="rotate(90 39 36)">
                      пр. Манаса / Ч. Айтматова
                    </text>

                    {/* Togolok Moldo */}
                    <line x1="47" y1="25" x2="47" y2="65" stroke="#ded8ca" strokeWidth="1.2" />

                    {/* Sovietskaya / Yusup Abdrakhmanov / Baitik Baatyra */}
                    <line x1="60" y1="20" x2="60" y2="92" stroke="#d1c7b3" strokeWidth="3.2" />
                    <text x="61.2" y="36" fontSize="2.1" fill="#786e5e" fontWeight="700" transform="rotate(90 61.2 36)">
                      ул. Байтик Баатыра / Советская
                    </text>

                    {/* Yunusalieva (7,8,9,10,11,12 mkr) */}
                    <line x1="68" y1="58" x2="68" y2="88" stroke="#d8d1c1" strokeWidth="2.2" />
                    <text x="69.2" y="66" fontSize="1.8" fill="#8d8474" transform="rotate(90 69.2 66)">
                      ул. Юнусалиева
                    </text>

                    {/* 7th April (Shabdan Baatyr / Alma-Atinskaya) */}
                    <line x1="78" y1="20" x2="78" y2="86" stroke="#d5cebe" strokeWidth="2.4" />

                    {/* District Labels */}
                    <text x="82" y="42" fontSize="2.2" fill="#999080" fontWeight="bold">
                      мкр. Восток-5
                    </text>
                    <text x="25" y="74" fontSize="2.2" fill="#999080" fontWeight="bold">
                      мкр. Джал
                    </text>
                    <text x="75" y="82" fontSize="2.2" fill="#999080" fontWeight="bold">
                      мкр. Асанбай
                    </text>
                    <text x="24" y="58" fontSize="2.0" fill="#999080">
                      Политех
                    </text>

                    {/* Route Line (BB Kitchen -> Waypoint -> Destination) */}
                    <polyline
                      points={`${startX},${startY} ${midX},${midY} ${endX},${endY}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.2"
                      strokeDasharray="2 1.5"
                      strokeLinecap="round"
                    />

                    {/* Completed Portion of Route */}
                    <polyline
                      points={
                        courierProgress < 30
                          ? `${startX},${startY} ${currentCourierX},${currentCourierY}`
                          : `${startX},${startY} ${midX},${midY} ${currentCourierX},${currentCourierY}`
                      }
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />

                    {/* Origin Pin: BB Pizza Kitchen */}
                    <circle cx={startX} cy={startY} r="3" fill="#b45309" />
                    <circle cx={startX} cy={startY} r="1.6" fill="#ffffff" />
                    <text x={startX} y={startY - 4.5} fontSize="2.4" fill="#78350f" fontWeight="bold" textAnchor="middle">
                      🍕 BB Pizza (пер. Геологический, 3)
                    </text>

                    {/* Destination Pin: Customer */}
                    <circle cx={endX} cy={endY} r="3.2" fill="#dc2626" />
                    <circle cx={endX} cy={endY} r="1.8" fill="#ffffff" />
                    <text x={endX} y={endY + 5.5} fontSize="2.4" fill="#991b1b" fontWeight="bold" textAnchor="middle">
                      📍 {order.customer.district}
                    </text>

                    {/* Live Courier Marker */}
                    <g transform={`translate(${currentCourierX}, ${currentCourierY})`}>
                      {/* Pulsing GPS Waves */}
                      <circle cx="0" cy="0" r="4.5" fill="#f59e0b" opacity="0.3">
                        <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                      </circle>
                      {/* Courier Background Pin */}
                      <circle cx="0" cy="0" r="3" fill="#1c1917" stroke="#ffffff" strokeWidth="0.8" />
                      {/* Mini Scooter representation */}
                      <circle cx="-0.8" cy="1" r="0.6" fill="#f59e0b" />
                      <circle cx="0.8" cy="1" r="0.6" fill="#f59e0b" />
                      <line x1="-0.8" y1="0.4" x2="0.8" y2="0.4" stroke="#ffffff" strokeWidth="0.5" />
                    </g>
                  </svg>
                </div>

                {/* Simulation Control HUD (Bottom) */}
                <div className="p-3 bg-white/95 backdrop-blur-md border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 font-medium">Симуляция движения:</span>
                    <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setSimulationSpeed(1)}
                        className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                          simulationSpeed === 1 ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600'
                        }`}
                      >
                        1x
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulationSpeed(3)}
                        className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                          simulationSpeed === 3 ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600'
                        }`}
                      >
                        3x
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulationSpeed(10)}
                        className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                          simulationSpeed === 10 ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600'
                        }`}
                      >
                        10x Экспресс
                      </button>
                    </div>
                  </div>

                  {/* Jump stages */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => jumpToStage(10)}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-semibold cursor-pointer"
                    >
                      Кухня
                    </button>
                    <button
                      type="button"
                      onClick={() => jumpToStage(50)}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-semibold cursor-pointer"
                    >
                      В печи
                    </button>
                    <button
                      type="button"
                      onClick={() => jumpToStage(75)}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-semibold cursor-pointer"
                    >
                      В пути
                    </button>
                    <button
                      type="button"
                      onClick={() => jumpToStage(100)}
                      className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded text-[11px] font-bold cursor-pointer"
                    >
                      Доставлен
                    </button>
                  </div>
                </div>
              </div>

              {/* Status & Courier Details Panel (5 cols on lg) */}
              <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-6 overflow-y-auto">
                {/* 5-Step Order Status Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Статус заказа #{order.id}
                    </h3>
                    <span className="text-xs font-bold text-amber-700 tabular-nums">
                      {Math.round(courierProgress)}% выполнено
                    </span>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${courierProgress}%` }}
                    />
                  </div>

                  {/* Vertical Timeline */}
                  <div className="space-y-3 pt-2 text-xs">
                    {[
                      {
                        key: 'confirmed',
                        threshold: 0,
                        title: 'Заказ подтвержден и оплачен',
                        desc: `Оплата картой ${order.payment.cardBrand?.toUpperCase() || 'ЭЛКАРТ'} •••• ${order.payment.cardLast4 || '7382'}`,
                        icon: CheckCircle2,
                      },
                      {
                        key: 'preparing',
                        threshold: 20,
                        title: 'На кухне: раскатка теста Tipo 00',
                        desc: 'Шеф-пиццайоло сформировал бортики и нанес соус San Marzano',
                        icon: ChefHat,
                      },
                      {
                        key: 'baking',
                        threshold: 40,
                        title: 'Выпекание в горячей печи (380°C)',
                        desc: 'Пышный припек, тянущаяся моцарелла и аппетитная хрустящая корочка',
                        icon: Flame,
                      },
                      {
                        key: 'on_the_way',
                        threshold: 60,
                        title: 'Курьер везет заказ в термосумке',
                        desc: `Едет по маршруту: ${currentStreetName}`,
                        icon: Bike,
                      },
                      {
                        key: 'delivered',
                        threshold: 99,
                        title: 'Заказ успешно доставлен!',
                        desc: 'Приятного аппетита! Спасибо, что выбираете BB Pizza',
                        icon: PackageCheck,
                      },
                    ].map((step, idx) => {
                      const isCompleted = courierProgress >= step.threshold;
                      const isCurrent =
                        courierProgress >= step.threshold &&
                        (idx === 4 || courierProgress < [20, 40, 60, 99, 101][idx]);
                      const StepIcon = step.icon;

                      return (
                        <div key={step.key} className="flex items-start gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                              isCompleted
                                ? isCurrent
                                  ? 'bg-amber-500 text-stone-950 border-amber-500 ring-4 ring-amber-100'
                                  : 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-stone-100 text-stone-400 border-stone-200'
                            }`}
                          >
                            <StepIcon className="w-3.5 h-3.5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-bold ${
                                isCurrent
                                  ? 'text-stone-900 text-sm'
                                  : isCompleted
                                  ? 'text-stone-800'
                                  : 'text-stone-400'
                              }`}
                            >
                              {step.title}
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Courier Profile Card */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Ваш курьер в Бишкеке
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      ★ {order.courier.rating} рейтинг
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 font-black flex items-center justify-center text-lg shrink-0">
                      БА
                    </div>
                    <div>
                      <div className="font-extrabold text-stone-900 text-sm">
                        {order.courier.name}
                      </div>
                      <div className="text-xs text-stone-500">
                        {order.courier.vehicle} · {order.courier.ordersDelivered} доставок
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${order.courier.phone}`}
                      className="py-2 px-3 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-bold text-stone-800 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-stone-600" />
                      <span>Позвонить</span>
                    </a>
                    <a
                      href="https://wa.me/996555312312"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Order Summary Dropdown / Receipt */}
                <div className="pt-2 border-t border-stone-200 text-xs text-stone-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Адрес получателя:</span>
                    <span className="font-bold text-stone-900 truncate max-w-[200px]">
                      {order.customer.street}, {order.customer.apartment || ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Позиций в заказе:</span>
                    <span className="font-bold text-stone-900 tabular-nums">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} шт
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-900 font-bold pt-1">
                    <span>Оплачено онлайн картой:</span>
                    <span className="text-sm font-black tabular-nums text-emerald-700">
                      {order.total} сом
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
