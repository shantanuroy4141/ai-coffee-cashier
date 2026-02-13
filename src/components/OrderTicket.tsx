"use client";

import { Order, OrderStatus } from "@/lib/types";
import { formatPrice, getMenuItem } from "@/lib/menu";

interface OrderTicketProps {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  pending: {
    label: "New",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  in_progress: {
    label: "Making",
    bg: "bg-greek-50",
    text: "text-greek-700",
    border: "border-greek-200",
  },
  completed: {
    label: "Done",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
};

export default function OrderTicket({
  order,
  onStatusChange,
}: OrderTicketProps) {
  const status = statusConfig[order.status];
  const timeAgo = getTimeAgo(order.createdAt);

  return (
    <div
      className={`rounded-2xl border-2 ${status.border} ${status.bg} p-4 transition-all hover:shadow-md`}
    >
      {/* Ticket Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-greek-800">
            #{order.id.slice(0, 6).toUpperCase()}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text} border ${status.border}`}
          >
            {status.label}
          </span>
        </div>
        <span className="text-xs text-greek-500">{timeAgo}</span>
      </div>

      {/* Customer Name */}
      <p className="text-sm font-medium text-greek-700 mb-3">
        {order.customerName}
      </p>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white/70 rounded-xl p-3 border border-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm text-greek-900">
                  {getMenuItem(item.menuItemId)?.isPastry
                    ? item.name
                    : `${item.size} ${item.name}`}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {!getMenuItem(item.menuItemId)?.isPastry && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-greek-100 text-greek-600">
                      {item.temperature}
                    </span>
                  )}
                  {item.milk !== "whole" && item.milk !== "none" && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-greek-100 text-greek-600">
                      {item.milk} milk
                    </span>
                  )}
                  {item.sweetness !== "normal" && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-greek-100 text-greek-600">
                      {item.sweetness} sweet
                    </span>
                  )}
                  {item.ice !== "normal" && item.temperature === "iced" && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-greek-100 text-greek-600">
                      {item.ice}
                    </span>
                  )}
                  {item.extraShots > 0 && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700">
                      +{item.extraShots} shot{item.extraShots > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {item.addOns.length > 0 && (
                  <p className="text-[11px] text-greek-500 mt-1">
                    + {item.addOns.join(", ")}
                  </p>
                )}
                {item.specialInstructions && (
                  <p className="text-[11px] text-greek-400 italic mt-0.5">
                    Note: {item.specialInstructions}
                  </p>
                )}
              </div>
              <span className="text-xs font-medium text-greek-600">
                {formatPrice(item.price)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center text-sm border-t border-greek-200/50 pt-2 mb-3">
        <span className="text-greek-600">
          {order.items.length} item{order.items.length > 1 ? "s" : ""}
        </span>
        <span className="font-bold text-greek-800">
          {formatPrice(order.totalPrice)}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {order.status === "pending" && (
          <button
            onClick={() => onStatusChange(order.id, "in_progress")}
            className="flex-1 py-2 px-3 bg-greek-500 text-white rounded-xl text-sm font-medium hover:bg-greek-600 transition-colors shadow-sm"
          >
            Start Making
          </button>
        )}
        {order.status === "in_progress" && (
          <button
            onClick={() => onStatusChange(order.id, "completed")}
            className="flex-1 py-2 px-3 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
          >
            Mark Complete
          </button>
        )}
        {order.status === "completed" && (
          <div className="flex-1 py-2 px-3 text-center text-green-600 text-sm font-medium">
            &#10003; Completed
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  return `${diffHours}h ago`;
}
