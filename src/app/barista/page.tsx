"use client";

import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import OrderTicket from "@/components/OrderTicket";
import StaffCodePrompt from "@/components/StaffCodePrompt";
import { useStaffAuth } from "@/lib/staffAuth";
import { Order, OrderStatus } from "@/lib/types";

export default function BaristaPage() {
  const { hasBaristaAccess } = useStaffAuth();

  if (!hasBaristaAccess) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">&#9749;</div>
          <h2 className="font-display text-xl font-bold text-greek-800 mb-2">
            Barista Access
          </h2>
          <p className="text-sm text-greek-600 mb-6">
            Enter your barista code to view the order queue
          </p>
          <StaffCodePrompt target="barista" compact />
        </div>
      </div>
    );
  }
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  async function handleStatusChange(id: string, status: OrderStatus) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id
              ? { ...o, status, updatedAt: new Date().toISOString() }
              : o
          )
        );
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  }

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const inProgressCount = orders.filter(
    (o) => o.status === "in_progress"
  ).length;
  const completedCount = orders.filter(
    (o) => o.status === "completed"
  ).length;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white border-b border-greek-100 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-greek-800">
              Order Queue
            </h1>
            <p className="text-xs text-greek-500">
              {orders.length} total order{orders.length !== 1 ? "s" : ""}
              {pendingCount > 0 && (
                <span className="ml-2 text-amber-600 font-medium">
                  {pendingCount} new
                </span>
              )}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-greek-50 rounded-2xl p-1">
            {[
              { key: "all", label: "All", count: orders.length },
              { key: "pending", label: "New", count: pendingCount },
              { key: "in_progress", label: "Making", count: inProgressCount },
              { key: "completed", label: "Done", count: completedCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as "all" | OrderStatus)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filter === tab.key
                    ? "bg-white text-greek-700 shadow-sm"
                    : "text-greek-500 hover:text-greek-700"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 bg-greek-100 text-greek-600 px-1.5 py-0.5 rounded-full text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-4 border-greek-200 border-t-greek-500 rounded-full" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl mb-4">&#9749;</div>
              <h3 className="font-display text-lg font-bold text-greek-700 mb-2">
                {filter === "all"
                  ? "No orders yet"
                  : `No ${filter === "in_progress" ? "in-progress" : filter} orders`}
              </h3>
              <p className="text-sm text-greek-500">
                {filter === "all"
                  ? "Orders will appear here when customers place them."
                  : "Try changing the filter to see other orders."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="animate-fade-in">
                  <OrderTicket
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
