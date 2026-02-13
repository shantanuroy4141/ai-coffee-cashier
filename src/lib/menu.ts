import { MenuItem, AddOn } from "./types";

export const menuItems: MenuItem[] = [
  // === COFFEE ===
  {
    id: "americano",
    name: "Americano",
    category: "coffee",
    description: "Espresso with hot water",
    prices: { S: 3.0, L: 4.0 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: false,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "latte",
    name: "Latte",
    category: "coffee",
    description: "Espresso with steamed milk and light foam",
    prices: { S: 4.0, L: 5.0 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    category: "coffee",
    description: "Slow-steeped cold coffee, smooth and bold",
    prices: { S: 4.0, L: 5.0 },
    canBeHot: false,
    canBeCold: true,
    hasMilk: false,
    defaultTemp: "iced",
    caffeinated: true,
  },
  {
    id: "mocha",
    name: "Mocha",
    category: "coffee",
    description: "Espresso with chocolate and steamed milk",
    prices: { S: 4.5, L: 5.5 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "coffee-frappuccino",
    name: "Coffee Frappuccino",
    category: "coffee",
    description: "Blended iced coffee with milk and cream",
    prices: { S: 5.5, L: 6.0 },
    canBeHot: false,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "iced",
    caffeinated: true,
  },

  // === TEA ===
  {
    id: "black-tea",
    name: "Black Tea",
    category: "tea",
    description: "Classic black tea",
    prices: { S: 3.0, L: 3.75 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: false,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "jasmine-tea",
    name: "Jasmine Tea",
    category: "tea",
    description: "Fragrant jasmine green tea",
    prices: { S: 3.0, L: 3.75 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: false,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "lemon-green-tea",
    name: "Lemon Green Tea",
    category: "tea",
    description: "Green tea with lemon",
    prices: { S: 3.5, L: 4.25 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: false,
    defaultTemp: "hot",
    caffeinated: true,
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    category: "tea",
    description: "Japanese matcha green tea with steamed milk",
    prices: { S: 4.5, L: 5.25 },
    canBeHot: true,
    canBeCold: true,
    hasMilk: true,
    defaultTemp: "hot",
    caffeinated: true,
  },

  // === PASTRY ===
  {
    id: "plain-croissant",
    name: "Plain Croissant",
    category: "pastry",
    description: "Fresh-baked butter croissant",
    prices: { S: 3.5, L: 3.5 },
    isPastry: true,
    canBeHot: false,
    canBeCold: false,
    hasMilk: false,
    defaultTemp: "hot",
    caffeinated: false,
  },
  {
    id: "chocolate-croissant",
    name: "Chocolate Croissant",
    category: "pastry",
    description: "Croissant with chocolate filling",
    prices: { S: 4.0, L: 4.0 },
    isPastry: true,
    canBeHot: false,
    canBeCold: false,
    hasMilk: false,
    defaultTemp: "hot",
    caffeinated: false,
  },
  {
    id: "chocolate-chip-cookie",
    name: "Chocolate Chip Cookie",
    category: "pastry",
    description: "Homemade chocolate chip cookie",
    prices: { S: 2.5, L: 2.5 },
    isPastry: true,
    canBeHot: false,
    canBeCold: false,
    hasMilk: false,
    defaultTemp: "hot",
    caffeinated: false,
  },
  {
    id: "banana-bread",
    name: "Banana Bread (Slice)",
    category: "pastry",
    description: "Fresh banana bread slice",
    prices: { S: 3.0, L: 3.0 },
    isPastry: true,
    canBeHot: false,
    canBeCold: false,
    hasMilk: false,
    defaultTemp: "hot",
    caffeinated: false,
  },
];

export const addOns: AddOn[] = [
  { id: "oat-milk", name: "Oat Milk", price: 0.5 },
  { id: "almond-milk", name: "Almond Milk", price: 0.75 },
  { id: "extra-espresso", name: "Extra Espresso Shot", price: 1.5 },
  { id: "extra-matcha", name: "Extra Matcha Shot", price: 1.5 },
  { id: "caramel-syrup", name: "1 Pump Caramel Syrup", price: 0.5 },
  { id: "hazelnut-syrup", name: "1 Pump Hazelnut Syrup", price: 0.5 },
  { id: "whole-skim-milk", name: "Whole/Skim Milk", price: 0 },
];

export const categories = [
  { id: "coffee", label: "Coffee" },
  { id: "tea", label: "Tea" },
  { id: "pastry", label: "Pastry" },
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
