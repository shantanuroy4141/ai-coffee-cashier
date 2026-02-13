"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardMetrics } from "@/lib/types";
import { formatPrice } from "@/lib/menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#2563eb",
  "#1d4ed8",
  "#bfdbfe",
  "#1e40af",
  "#dbeafe",
];

function MetricCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-greek-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-greek-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-greek-800 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-greek-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-greek-50 flex items-center justify-center text-greek-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-greek-200 border-t-greek-500 rounded-full" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-full text-greek-500">
        Failed to load metrics
      </div>
    );
  }

  const hasData = metrics.totalOrders > 0;

  return (
    <div className="p-6 overflow-y-auto h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-greek-800">
            Business Dashboard
          </h1>
          <p className="text-sm text-greek-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          className="px-4 py-2 bg-greek-50 text-greek-600 rounded-xl text-sm font-medium hover:bg-greek-100 transition-colors border border-greek-200"
        >
          Refresh
        </button>
      </div>

      {!hasData ? (
        <div className="bg-white rounded-2xl border border-greek-100 p-12 text-center">
          <div className="text-4xl mb-4">&#9749;</div>
          <h3 className="font-display text-lg font-bold text-greek-700 mb-2">
            No orders yet today
          </h3>
          <p className="text-sm text-greek-500">
            Orders placed in the Customer view will appear here. Head to the
            Customer tab to place some orders!
          </p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Orders"
              value={metrics.totalOrders.toString()}
              subtitle={`${metrics.totalItemsSold} items sold`}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            />
            <MetricCard
              title="Total Revenue"
              value={formatPrice(metrics.totalRevenue)}
              subtitle={`Avg ${formatPrice(metrics.averageOrderValue)}/order`}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <MetricCard
              title="Peak Hour"
              value={metrics.peakHour}
              subtitle="Busiest time of day"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <MetricCard
              title="Avg Items/Order"
              value={metrics.averageItemsPerOrder.toFixed(1)}
              subtitle="Items per transaction"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              }
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders by Hour */}
            <div className="bg-white rounded-2xl border border-greek-100 p-5 shadow-sm">
              <h3 className="font-semibold text-greek-800 mb-4">
                Orders by Hour
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metrics.ordersByHour}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e0e7ff"
                  />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    allowDecimals={false}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Drinks */}
            <div className="bg-white rounded-2xl border border-greek-100 p-5 shadow-sm">
              <h3 className="font-semibold text-greek-800 mb-4">
                Most Popular Drinks
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={metrics.topDrinks}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e0e7ff"
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    width={100}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Size Distribution */}
            <div className="bg-white rounded-2xl border border-greek-100 p-5 shadow-sm">
              <h3 className="font-semibold text-greek-800 mb-4">
                Size Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={metrics.sizeDistribution.filter((s) => s.count > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {metrics.sizeDistribution
                      .filter((s) => s.count > 0)
                      .map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {metrics.sizeDistribution
                  .filter((s) => s.count > 0)
                  .map((s, i) => (
                    <div key={s.size} className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i] }}
                      />
                      <span className="text-xs text-greek-600">
                        {s.size === "S" ? "Small" : "Large"}{" "}
                        ({s.count})
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Milk Preferences */}
            <div className="bg-white rounded-2xl border border-greek-100 p-5 shadow-sm">
              <h3 className="font-semibold text-greek-800 mb-4">
                Milk Preferences
              </h3>
              <div className="space-y-3">
                {metrics.milkPreferences.slice(0, 6).map((m) => {
                  const total = metrics.milkPreferences.reduce(
                    (s, mp) => s + mp.count,
                    0
                  );
                  const pct = total > 0 ? (m.count / total) * 100 : 0;
                  return (
                    <div key={m.milk}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-greek-700 capitalize font-medium">
                          {m.milk}
                        </span>
                        <span className="text-greek-500">
                          {m.count} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-greek-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-greek-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-2xl border border-greek-100 p-5 shadow-sm">
              <h3 className="font-semibold text-greek-800 mb-4">
                Order Status
              </h3>
              <div className="space-y-3">
                {metrics.ordersByStatus.map((s) => {
                  const colors: Record<string, { bg: string; fill: string }> = {
                    pending: { bg: "bg-amber-100", fill: "bg-amber-400" },
                    in_progress: {
                      bg: "bg-greek-100",
                      fill: "bg-greek-400",
                    },
                    completed: { bg: "bg-green-100", fill: "bg-green-400" },
                  };
                  const labels: Record<string, string> = {
                    pending: "Pending",
                    in_progress: "In Progress",
                    completed: "Completed",
                  };
                  const c = colors[s.status] || colors.pending;
                  const pct =
                    metrics.totalOrders > 0
                      ? (s.count / metrics.totalOrders) * 100
                      : 0;
                  return (
                    <div key={s.status}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-greek-700 font-medium">
                          {labels[s.status] || s.status}
                        </span>
                        <span className="text-greek-500">{s.count}</span>
                      </div>
                      <div
                        className={`w-full h-2 ${c.bg} rounded-full overflow-hidden`}
                      >
                        <div
                          className={`h-full ${c.fill} rounded-full transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Category breakdown */}
              <h3 className="font-semibold text-greek-800 mb-3 mt-6">
                By Category
              </h3>
              <div className="space-y-2">
                {metrics.drinksByCategory.map((d) => (
                  <div
                    key={d.category}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="text-greek-700 capitalize font-medium">
                      {d.category === "non-coffee"
                        ? "Non-Coffee"
                        : d.category}
                    </span>
                    <span className="bg-greek-50 px-2 py-0.5 rounded-lg text-greek-600 font-medium">
                      {d.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
