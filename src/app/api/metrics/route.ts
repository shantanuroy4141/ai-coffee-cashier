import { NextResponse } from "next/server";
import { orderStore } from "@/lib/store";
import { menuItems } from "@/lib/menu";
import { DashboardMetrics, Order } from "@/lib/types";

function computeMetrics(orders: Order[]): DashboardMetrics {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Orders by hour
  const hourCounts: Record<string, number> = {};
  for (let h = 6; h <= 22; h++) {
    const label = `${h.toString().padStart(2, "0")}:00`;
    hourCounts[label] = 0;
  }
  for (const order of orders) {
    const hour = new Date(order.createdAt).getHours();
    const label = `${hour.toString().padStart(2, "0")}:00`;
    if (hourCounts[label] !== undefined) {
      hourCounts[label]++;
    }
  }
  const ordersByHour = Object.entries(hourCounts).map(([hour, count]) => ({
    hour,
    count,
  }));

  // Top drinks
  const drinkCounts: Record<string, number> = {};
  let totalItemsSold = 0;
  for (const order of orders) {
    for (const item of order.items) {
      totalItemsSold++;
      drinkCounts[item.name] = (drinkCounts[item.name] || 0) + 1;
    }
  }
  const topDrinks = Object.entries(drinkCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Orders by status
  const statusCounts: Record<string, number> = {
    pending: 0,
    in_progress: 0,
    completed: 0,
  };
  for (const order of orders) {
    statusCounts[order.status]++;
  }
  const ordersByStatus = Object.entries(statusCounts).map(
    ([status, count]) => ({ status, count })
  );

  // Drinks by category mapping
  const categoryMap: Record<string, string> = {};
  for (const item of menuItems) {
    categoryMap[item.id] = item.category;
  }
  const catCounts: Record<string, number> = {};
  for (const order of orders) {
    for (const item of order.items) {
      const cat = categoryMap[item.menuItemId] || "other";
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
  }
  const drinksByCategory = Object.entries(catCounts).map(
    ([category, count]) => ({ category, count })
  );

  // Average items per order
  const averageItemsPerOrder =
    totalOrders > 0 ? totalItemsSold / totalOrders : 0;

  // Milk preferences
  const milkCounts: Record<string, number> = {};
  for (const order of orders) {
    for (const item of order.items) {
      const milk = item.milk || "whole";
      milkCounts[milk] = (milkCounts[milk] || 0) + 1;
    }
  }
  const milkPreferences = Object.entries(milkCounts)
    .map(([milk, count]) => ({ milk, count }))
    .sort((a, b) => b.count - a.count);

  // Size distribution
  const sizeCounts: Record<string, number> = { S: 0, M: 0, L: 0 };
  for (const order of orders) {
    for (const item of order.items) {
      if (sizeCounts[item.size] !== undefined) {
        sizeCounts[item.size]++;
      }
    }
  }
  const sizeDistribution = Object.entries(sizeCounts).map(([size, count]) => ({
    size,
    count,
  }));

  // Peak hour
  let peakHour = "N/A";
  let maxCount = 0;
  for (const { hour, count } of ordersByHour) {
    if (count > maxCount) {
      maxCount = count;
      peakHour = hour;
    }
  }

  return {
    totalOrders,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    ordersByHour,
    topDrinks,
    ordersByStatus,
    drinksByCategory,
    averageItemsPerOrder: Math.round(averageItemsPerOrder * 100) / 100,
    milkPreferences,
    sizeDistribution,
    peakHour,
    totalItemsSold,
  };
}

export async function GET() {
  const orders = orderStore.getAllOrders();
  const metrics = computeMetrics(orders);
  return NextResponse.json({ metrics });
}
