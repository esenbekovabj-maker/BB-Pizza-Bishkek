import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { PizzaModal } from './components/PizzaModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PaymentModal } from './components/PaymentModal';
import { BishkekLiveTracker } from './components/BishkekLiveTracker';
import { DeliveryZonesModal } from './components/DeliveryZonesModal';
import { Footer } from './components/Footer';
import {
  CartItem,
  MenuItem,
  Order,
  OrderCustomer,
  PaymentMethod,
  CardBrand,
  PizzaSize,
  CrustType,
  ExtraTopping,
} from './types';
import { MENU_ITEMS } from './data/menu';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function App() {
  // Cart state with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bb_pizza_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active order state with localStorage
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('bb_pizza_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals visibility
  const [selectedPizza, setSelectedPizza] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isZonesOpen, setIsZonesOpen] = useState(false);

  // Checkout pending details
  const [pendingCustomer, setPendingCustomer] = useState<OrderCustomer | null>(null);
  const [pendingDeliveryFee, setPendingDeliveryFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bb_pizza_cart', JSON.stringify(cart));
    } catch {
      // storage unavailable
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('bb_pizza_order', JSON.stringify(activeOrder));
      }
    } catch {
      // storage unavailable
    }
  }, [activeOrder]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  // Add customized pizza to cart
  const handleAddToCart = (params: {
    menuItem: MenuItem;
    size: PizzaSize;
    crust: CrustType;
    addedToppings: ExtraTopping[];
    removedIngredients: string[];
    quantity: number;
    unitPrice: number;
  }) => {
    const cartItemId = `${params.menuItem.id}-${params.size}-${params.crust}-${params.addedToppings
      .map((t) => t.id)
      .join('-')}-${params.removedIngredients.join('-')}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? {
                ...item,
                quantity: item.quantity + params.quantity,
                totalPrice: (item.quantity + params.quantity) * item.unitPrice,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItem: params.menuItem,
          size: params.size,
          crust: params.crust,
          addedToppings: params.addedToppings,
          removedIngredients: params.removedIngredients,
          quantity: params.quantity,
          unitPrice: params.unitPrice,
          totalPrice: params.unitPrice * params.quantity,
        },
      ];
    });

    showToast(`«${params.menuItem.name}» добавлена в корзину`);
  };

  // Quick 1-click add standard pizza
  const handleQuickAdd = (menuItem: MenuItem) => {
    handleAddToCart({
      menuItem,
      size: '30cm',
      crust: 'traditional',
      addedToppings: [],
      removedIngredients: [],
      quantity: 1,
      unitPrice: menuItem.sizePrices['30cm'],
    });
  };

  // Quick 1-click remove or decrement item by menuItem.id
  const handleQuickRemove = (itemId: string) => {
    setCart((prev) => {
      const index = prev.findIndex((i) => i.menuItem.id === itemId);
      if (index === -1) return prev;
      const target = prev[index];
      if (target.quantity > 1) {
        return prev.map((item, idx) =>
          idx === index
            ? { ...item, quantity: item.quantity - 1, totalPrice: (item.quantity - 1) * item.unitPrice }
            : item
        );
      } else {
        return prev.filter((_, idx) => idx !== index);
      }
    });
  };

  // Get total quantity of an item currently in cart
  const getItemQuantity = (itemId: string): number => {
    return cart
      .filter((i) => i.menuItem.id === itemId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId
          ? { ...i, quantity: newQty, totalPrice: newQty * i.unitPrice }
          : i
      )
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleApplyPromo = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BBPIZZA' || clean === 'BISHKEK' || clean === 'BB10') {
      const discountVal = Math.round(cartSubtotal * 0.1);
      setDiscount(discountVal);
      showToast('Промокод применен: скидка 10%!');
      return true;
    }
    return false;
  };

  // Proceed from Cart to Checkout modal
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Submit checkout form
  const handleStartPayment = (
    customer: OrderCustomer,
    method: PaymentMethod,
    deliveryFee: number
  ) => {
    setPendingCustomer(customer);
    setPendingDeliveryFee(deliveryFee);
    setIsCheckoutOpen(false);

    if (method === 'card') {
      // Open online card payment modal
      setIsPaymentOpen(true);
    } else {
      // Instant creation for MBank / Cash
      createNewOrder({
        customer,
        deliveryFee,
        payment: {
          method,
          status: method === 'mbank' ? 'paid' : 'pending',
          transactionId: `MBANK-${Math.floor(100000 + Math.random() * 900000)}`,
        },
      });
    }
  };

  // Complete Card payment successfully
  const handlePaymentSuccess = (paymentInfo: {
    brand: CardBrand;
    last4: string;
    transactionId: string;
  }) => {
    if (!pendingCustomer) return;

    setIsPaymentOpen(false);
    createNewOrder({
      customer: pendingCustomer,
      deliveryFee: pendingDeliveryFee,
      payment: {
        method: 'card',
        cardBrand: paymentInfo.brand,
        cardLast4: paymentInfo.last4,
        status: 'paid',
        transactionId: paymentInfo.transactionId,
        paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    });
  };

  // Construct and activate the order
  const createNewOrder = (params: {
    customer: OrderCustomer;
    deliveryFee: number;
    payment: Order['payment'];
  }) => {
    const newOrderId = `BB-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalTotal = Math.max(0, cartSubtotal - discount + params.deliveryFee);

    const newOrder: Order = {
      id: newOrderId,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: params.deliveryFee,
      discount,
      total: finalTotal,
      customer: params.customer,
      payment: params.payment,
      status: 'confirmed',
      progressPercent: 5,
      estimatedMinutes: 30,
      courier: {
        name: 'Бакыт Асанов',
        phone: '+996 555 312 901',
        vehicle: 'Honda Dio (скутер)',
        rating: 4.98,
        ordersDelivered: 1240,
        currentStreet: 'пер. Геологический, 3 (возле BB Pizza)',
        distanceKm: 3.2,
        speedKmh: 35,
      },
      timeline: [
        {
          status: 'confirmed',
          label: 'Заказ подтвержден',
          subtext: `Успешно оплачен · ${params.payment.cardBrand?.toUpperCase() || 'КАРТА'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
        },
      ],
    };

    setActiveOrder(newOrder);
    setCart([]); // Clear cart
    setDiscount(0);
    setIsTrackerOpen(true);
    showToast(`Заказ #${newOrderId} оформлен! Отслеживайте курьера на карте.`);
  };

  // Seed interactive demo order to explore the map immediately
  const handleSeedDemoOrder = () => {
    const demoItem = MENU_ITEMS[0];
    const demoCartItem: CartItem = {
      cartItemId: 'demo-item',
      menuItem: demoItem,
      size: '30cm',
      crust: 'cheese_crust',
      addedToppings: [{ id: 'top-mozzarella', name: 'Двойная моцарелла', price: 90 }],
      removedIngredients: [],
      quantity: 1,
      unitPrice: 810,
      totalPrice: 810,
    };

    const demoOrder: Order = {
      id: 'BB-9842',
      createdAt: '12:15',
      items: [demoCartItem],
      subtotal: 810,
      deliveryFee: 0,
      discount: 0,
      total: 810,
      customer: {
        name: 'Эсенбек',
        phone: '+996 700 889 900',
        district: 'мкр. Асанбай / 11, 12 мкр (Южная Магистраль)',
        street: 'ул. Аалы Токомбаева, 23/1',
        apartment: '42',
        entrance: '2',
        floor: '6',
        intercom: '42',
        comment: 'Позвонить в домофон',
      },
      payment: {
        method: 'card',
        cardBrand: 'elcard',
        cardLast4: '7382',
        status: 'paid',
        transactionId: 'TX-KG-984210',
        paidAt: '12:15',
      },
      status: 'on_the_way',
      progressPercent: 62,
      estimatedMinutes: 12,
      courier: {
        name: 'Бакыт Асанов',
        phone: '+996 555 312 901',
        vehicle: 'Honda Dio (скутер)',
        rating: 4.98,
        ordersDelivered: 1240,
        currentStreet: 'ул. Байтик Баатыра / ул. Ахунбаева',
        distanceKm: 2.1,
        speedKmh: 36,
      },
      timeline: [],
    };

    setActiveOrder(demoOrder);
    setIsTrackerOpen(true);
    showToast('Демо-заказ в Бишкеке активирован!');
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-stone-900 text-white rounded-xl shadow-2xl border border-stone-800 text-xs font-bold flex items-center gap-2.5 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Header
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateSection={handleNavigateSection}
        hasActiveOrder={Boolean(activeOrder)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenZones={() => setIsZonesOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onScrollToMenu={() => handleNavigateSection('menu')}
          onOpenTracker={() => setIsTrackerOpen(true)}
          hasActiveOrder={Boolean(activeOrder)}
        />

        {/* Menu Catalog Section */}
        <MenuSection
          onSelectPizza={(pizza) => setSelectedPizza(pizza)}
          onQuickAdd={handleQuickAdd}
          onQuickRemove={handleQuickRemove}
          getItemQuantity={getItemQuantity}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <PizzaModal
        pizza={selectedPizza}
        isOpen={Boolean(selectedPizza)}
        onClose={() => setSelectedPizza(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        subtotal={cartSubtotal}
        discount={discount}
        onApplyPromo={handleApplyPromo}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={cartSubtotal}
        discount={discount}
        onStartPayment={handleStartPayment}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={Math.max(0, cartSubtotal - discount + pendingDeliveryFee)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <BishkekLiveTracker
        order={activeOrder}
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onSeedDemoOrder={handleSeedDemoOrder}
      />

      <DeliveryZonesModal
        isOpen={isZonesOpen}
        onClose={() => setIsZonesOpen(false)}
      />
    </div>
  );
}
