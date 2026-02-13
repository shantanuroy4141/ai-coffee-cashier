import { MenuItem, AddOn } from "./types";

export const menuItems: MenuItem[] = [
  // === ESPRESSO DRINKS ===
  {
    id: "espresso",
    name: "Espresso",
    category: "espresso",
    description: "Rich, concentrated shot of coffee",
    prices: { S: 3.0, M: 3.5, L: 4.0 },
    canBeHot: true,
    canBeCold: false,
    hasMilk: false,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "americano",
    name: "Americano",
    category: "espresso",
    description: "Espresso with hot water",
    prices: { S: 3.5, M: 4.0, L: 4.5 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: false,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "latte",
    name: "Latte",
    category: "espresso",
    description: "Espresso with steamed milk and light foam",
    prices: { S: 4.5, M: 5.0, L: 5.5 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "espresso",
    description: "Equal parts espresso, steamed milk, and foam",
    prices: { S: 4.5, M: 5.0, L: 5.5 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "flat-white",
    name: "Flat White",
    category: "espresso",
    description: "Double espresso with velvety steamed milk",
    prices: { S: 4.5, M: 5.0, L: 5.5 },
    canBeHot: true,
    canBeCold: false,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "mocha",
    name: "Mocha",
    category: "espresso",
    description: "Espresso with chocolate and steamed milk",
    prices: { S: 5.0, M: 5.5, L: 6.0 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "macchiato",
    name: "Macchiato",
    category: "espresso",
    description: "Espresso marked with a dollop of foam",
    prices: { S: 3.5, M: 4.0, L: 4.5 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "cortado",
    name: "Cortado",
    category: "espresso",
    description: "Equal parts espresso and warm milk",
    prices: { S: 4.0, M: 4.5, L: 5.0 },
    canBeHot: true,
    canBeCold: false,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: true,
  },

  // === COLD DRINKS ===
  {
    id: "cold-brew",
    name: "Cold Brew",
    category: "cold",
    description: "Slow-steeped cold coffee, smooth and bold",
    prices: { S: 4.0, M: 4.5, L: 5.0 },
    canBeHot: false,
    canBeCold: true,
    hasMilk: false,
    defaultTemp: "iced",
    caffeinated: true,
  },
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    category: "cold",
    description: "Chilled brewed coffee over ice",
    prices: { S: 3.5, M: 4.0, L: 4.5 },
    canBeHot: false,
    canBeCold: true,
    hasMilk: false,
    defaultTemp: "iced",
    caffeinated: true,
  },
  {
    id: "frappuccino",
    name: "Frappuccino",
    category: "cold",
    description: "Blended iced coffee with milk and cream",
    prices: { S: 5.5, M: 6.0, L: 6.5 },
    canBeHot: false,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "iced",
    caffeinated: true,
  },

  // === NON-COFFEE ===
  {
    id: "hot-chocolate",
    name: "Hot Chocolate",
    category: "non-coffee",
    description: "Rich chocolate with steamed milk and whipped cream",
    prices: { S: 4.0, M: 4.5, L: 5.0 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: false,
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    category: "non-coffee",
    description: "Japanese matcha green tea with steamed milk",
    prices: { S: 5.0, M: 5.5, L: 6.0 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "steamer",
    name: "Steamer",
    category: "non-coffee",
    description: "Steamed milk with your choice of flavored syrup",
    prices: { S: 3.0, M: 3.5, L: 4.0 },
    canBeHot: true,
    canBeCold: false,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: false,
  },

  // === TEA ===
  {
    id: "chai-latte",
    name: "Chai Latte",
    category: "tea",
    description: "Spiced chai tea with steamed milk",
    prices: { S: 4.5, M: 5.0, L: 5.5 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "brewed-tea",
    name: "Brewed Tea",
    category: "tea",
    description: "Choose from Earl Grey, English Breakfast, Green, or Chamomile",
    prices: { S: 3.0, M: 3.5, L: 4.0 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: false,
    defaultTemp: "hot",
    caffeinated: true,
  },
];

export const addOns: AddOn[] = [
  { id: "extra-shot", name: "Extra Espresso Shot", price: 0.75 },
  { id: "vanilla-syrup", name: "Vanilla Syrup", price: 0.5 },
  { id: "caramel-syrup", name: "Caramel Syrup", price: 0.5 },
  { id: "hazelnut-syrup", name: "Hazelnut Syrup", price: 0.5 },
  { id: "mocha-syrup", name: "Mocha Syrup", price: 0.5 },
  { id: "lavender-syrup", name: "Lavender Syrup", price: 0.5 },
  { id: "oat-milk", name: "Oat Milk", price: 0.7 },
  { id: "almond-milk", name: "Almond Milk", price: 0.7 },
  { id: "soy-milk", name: "Soy Milk", price: 0.7 },
  { id: "coconut-milk", name: "Coconut Milk", price: 0.7 },
  { id: "whipped-cream", name: "Whipped Cream", price: 0.5 },
  { id: "cold-foam", name: "Cold Foam", price: 1.0 },
];

export const categories = [
  { id: "espresso", label: "Espresso Drinks" },
  { id: "cold", label: "Cold Drinks" },
  { id: "non-coffee", label: "Non-Coffee" },
  { id: "tea", label: "Tea" },
] as const;

export function getMenuItem(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function getMenuItemByName(name: string): MenuItem | undefined {
  return menuItems.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
