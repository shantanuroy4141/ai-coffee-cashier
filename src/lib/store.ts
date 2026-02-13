import { Order } from "./types";

// In-memory order store (persists as long as the server is running)
class OrderStore {
  private orders: Map<string, Order> = new Map();

  addOrder(order: Order): Order {
    this.orders.set(order.id, order);
    return order;
  }

  getOrder(id: string): Order | undefined {
    return this.orders.get(id);
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  updateOrderStatus(
    id: string,
    status: Order["status"]
  ): Order | undefined {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.orders.set(id, order);
    }
    return order;
  }

  getOrdersByStatus(status: Order["status"]): Order[] {
    return this.getAllOrders().filter((o) => o.status === status);
  }

  getOrdersCount(): number {
    return this.orders.size;
  }

  clearAll(): void {
    this.orders.clear();
  }
}

// Singleton instance
const globalForStore = globalThis as unknown as { orderStore: OrderStore };
export const orderStore =
  globalForStore.orderStore || new OrderStore();
if (process.env.NODE_ENV !== "production") {
  globalForStore.orderStore = orderStore;
}
