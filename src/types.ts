export type PizzaSize = '25cm' | '30cm' | '35cm';
export type CrustType = 'traditional' | 'thin' | 'cheese_crust';

export type CategoryId = 'all' | 'signature' | 'meat' | 'cheese' | 'spicy' | 'combos' | 'drinks';

export interface ExtraTopping {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  basePrice: number;
  image: string;
  weightGrams: {
    '25cm': number;
    '30cm': number;
    '35cm': number;
  };
  sizePrices: {
    '25cm': number;
    '30cm': number;
    '35cm': number;
  };
  badge?: string;
  spiciness?: number; // 0, 1, 2
  isHalal?: boolean;
  ingredients: string[];
  popular?: boolean;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  size: PizzaSize;
  crust: CrustType;
  addedToppings: ExtraTopping[];
  removedIngredients: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'confirmed' | 'preparing' | 'baking' | 'on_the_way' | 'delivered';

export interface OrderCustomer {
  name: string;
  phone: string;
  district: string;
  street: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  intercom?: string;
  comment?: string;
}

export type PaymentMethod = 'card' | 'mbank' | 'cash';
export type CardBrand = 'elcard' | 'visa' | 'mastercard';

export interface PaymentDetails {
  method: PaymentMethod;
  cardBrand?: CardBrand;
  cardLast4?: string;
  status: 'paid' | 'pending';
  transactionId: string;
  paidAt?: string;
}

export interface CourierInfo {
  name: string;
  phone: string;
  photo?: string;
  vehicle: string;
  rating: number;
  ordersDelivered: number;
  currentStreet: string;
  distanceKm: number;
  speedKmh: number;
}

export interface TimelineEvent {
  status: OrderStatus;
  label: string;
  subtext: string;
  time: string;
  completed: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customer: OrderCustomer;
  payment: PaymentDetails;
  status: OrderStatus;
  progressPercent: number; // 0 to 100
  estimatedMinutes: number;
  courier: CourierInfo;
  timeline: TimelineEvent[];
}
