export interface BishkekDistrict {
  id: string;
  name: string;
  zone: 'green' | 'yellow' | 'orange';
  minOrderSom: number;
  deliveryTimeMin: number;
  deliveryCostSom: number;
  description: string;
  coords: { x: number; y: number }; // normalized coords for SVG vector map [0..100]
}

export const BISHKEK_DISTRICTS: BishkekDistrict[] = [
  {
    id: 'center-alat-too',
    name: 'Центр (пл. Ала-Тоо, Чуй / Раззакова / Панфилова)',
    zone: 'green',
    minOrderSom: 500,
    deliveryTimeMin: 25,
    deliveryCostSom: 0,
    description: 'Зона экспресс-доставки — до 30 минут',
    coords: { x: 50, y: 46 },
  },
  {
    id: 'vostok-5',
    name: 'мкр. Восток-5 / пр. Чуй восток',
    zone: 'green',
    minOrderSom: 500,
    deliveryTimeMin: 30,
    deliveryCostSom: 0,
    description: 'Бесплатная доставка от 500 сом',
    coords: { x: 74, y: 43 },
  },
  {
    id: 'djal',
    name: 'мкр. Джал (Верхний / Нижний, Тыналиева)',
    zone: 'yellow',
    minOrderSom: 600,
    deliveryTimeMin: 35,
    deliveryCostSom: 70,
    description: 'Доставка 35-40 минут',
    coords: { x: 30, y: 72 },
  },
  {
    id: 'asanbay',
    name: 'мкр. Асанбай / 11, 12 мкр (Южная Магистраль)',
    zone: 'yellow',
    minOrderSom: 600,
    deliveryTimeMin: 35,
    deliveryCostSom: 70,
    description: 'Южная зона города, термосумки с подогревом',
    coords: { x: 68, y: 80 },
  },
  {
    id: '7-8-9-mkr',
    name: 'мкр. 7, 8, 9, 10 (Юнусалиева / Донецкая)',
    zone: 'yellow',
    minOrderSom: 600,
    deliveryTimeMin: 32,
    deliveryCostSom: 50,
    description: 'Быстрая доставка по ул. Юнусалиева',
    coords: { x: 64, y: 68 },
  },
  {
    id: 'kyzyl-asker',
    name: 'Кызыл-Аскер / Западный автовокзал',
    zone: 'orange',
    minOrderSom: 700,
    deliveryTimeMin: 40,
    deliveryCostSom: 100,
    description: 'Западный сектор города',
    coords: { x: 20, y: 38 },
  },
  {
    id: 'polytech-manas',
    name: 'Политех / пр. Ч. Айтматова (Мира) / Ахунбаева',
    zone: 'green',
    minOrderSom: 500,
    deliveryTimeMin: 28,
    deliveryCostSom: 0,
    description: 'Центрально-южный сектор',
    coords: { x: 42, y: 62 },
  },
  {
    id: 'karagachevaya',
    name: 'Север (Жибек Жолу / Карагачевая роща)',
    zone: 'orange',
    minOrderSom: 700,
    deliveryTimeMin: 40,
    deliveryCostSom: 90,
    description: 'Северная часть города',
    coords: { x: 55, y: 22 },
  },
];

export const BB_KITCHEN_LOCATION = {
  name: 'BB Pizza (пер. Геологический, 3 / ул. Ибраимова)',
  address: 'пер. Геологический, 3',
  coords: { x: 62, y: 54 },
  phone: '+996 (555) 312-312',
};
