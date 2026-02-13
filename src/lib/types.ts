export type DrinkSize = "S" | "L";
export type Temperature = "hot" | "iced";
export type MilkType =
  | "whole"
  | "skim"
  | "oat"
  | "almond"
  | "soy"
  | "coconut"
  | "none";
export type SweetnessLevel = "none" | "less" | "normal" | "extra";
export type IceLevel = "no ice" | "less ice" | "normal" | "extra ice";

export interface MenuItem {
  id: string;
  name: string;
  category: "coffee" | "tea" | "pastry";
  description: string;
  prices: { S: number; L: number };
  /** True if item has no size (pastry) - use S price for display */
  isPastry?: boolean;
  canBeHot: boolean;
  canBeCold: boolean;
  hasMilk: boolean;
  defaultTemp: Temperature;
  caffeinated: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  size: DrinkSize;
  temperature: Temperature;
  milk: MilkType;
  sweetness: SweetnessLevel;
  ice: IceLevel;
  addOns: string[];
  extraShots: number;
  specialInstructions: string;
  price: number;
}

export type OrderStatus = "pending" | "in_progress" | "completed";

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  customerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  order?: Order;
}

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByHour: { hour: string; count: number }[];
  topDrinks: { name: string; count: number }[];
  ordersByStatus: { status: string; count: number }[];
  drinksByCategory: { category: string; count: number }[];
  averageItemsPerOrder: number;
  milkPreferences: { milk: string; count: number }[];
  sizeDistribution: { size: string; count: number }[];
  peakHour: string;
  totalItemsSold: number;
}
