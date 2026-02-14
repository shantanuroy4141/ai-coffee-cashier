import { NextRequest, NextResponse } from "next/server";
import { orderStore } from "@/lib/store";
import { Order, OrderItem } from "@/lib/types";
import { getMenuItem, menuItems } from "@/lib/menu";
import { v4 as uuidv4 } from "uuid";

function normalizeMenuItemId(id: string): string {
  if (getMenuItem(id)) return id;
  const match = menuItems
    .filter((m) => id.startsWith(m.id))
    .sort((a, b) => b.id.length - a.id.length)[0];
  return match?.id ?? id;
}

function validateOrderItems(items: OrderItem[]): string | null {
  for (const item of items) {
    item.menuItemId = normalizeMenuItemId(item.menuItemId);
    if (!Array.isArray(item.addOns)) item.addOns = [];
    const menuItem = getMenuItem(item.menuItemId);
    if (!menuItem) return `Unknown item: ${item.menuItemId}`;
    if (menuItem.isPastry) continue;
    const milk = (item.milk ?? "whole").toLowerCase();
    if (!menuItem.hasMilk && milk !== "none") {
      return `${menuItem.name} can't have milk—suggest a Latte instead.`;
    }
  }
  return null;
}

export async function GET() {
  const orders = orderStore.getAllOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }

    const validationError = validateOrderItems(items as OrderItem[]);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const totalPrice = items.reduce(
      (sum: number, item: OrderItem) => sum + item.price,
      0
    );

    const order: Order = {
      id: uuidv4(),
      customerName: customerName || "Guest",
      items,
      totalPrice: Math.round(totalPrice * 100) / 100,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orderStore.addOrder(order);

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: unknown) {
    console.error("Order creation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
