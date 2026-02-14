"use client";

import { Order } from "@/lib/types";
import { formatPrice, getMenuItem } from "@/lib/menu";

interface OrderReceiptProps {
  order: Order;
}

export default function OrderReceipt({ order }: OrderReceiptProps) {
  return (
    <div className="bg-white rounded-2xl border-2 border-greek-200 shadow-lg max-w-sm mx-auto overflow-hidden">
      {/* Receipt Header */}
      <div className="bg-gradient-to-r from-greek-500 to-greek-600 text-white p-4 text-center">
        <div className="text-2xl mb-1">&#9749;</div>
        <h3 className="font-display font-bold text-lg">Aegean Brew</h3>
        <p className="text-greek-100 text-xs">Order Receipt</p>
      </div>

      <div className="p-4">
        {/* Order Info */}
        <div className="flex justify-between text-xs text-greek-500 mb-3 pb-3 border-b border-dashed border-greek-200">
          <span>Order #{order.id.slice(0, 8)}</span>
          <span>
            {new Date(order.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="text-sm text-greek-700 mb-3">
          <span className="font-medium">Customer:</span> {order.customerName}
        </div>

        {/* Items */}
        <div className="space-y-3 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="border-b border-greek-100 pb-3 last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-greek-900">
                    {item.name}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {!getMenuItem(item.menuItemId)?.isPastry && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-greek-50 text-greek-600">
                        {item.size === "S" ? "Small" : "Large"}
                      </span>
                    )}
                    {!getMenuItem(item.menuItemId)?.isPastry && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-greek-50 text-greek-600">
                        {item.temperature}
                      </span>
                    )}
                    {item.milk !== "whole" && item.milk !== "none" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-greek-50 text-greek-600">
                        {item.milk} milk
                      </span>
                    )}
                    {item.extraShots > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-greek-50 text-greek-600">
                        +{item.extraShots} shot{item.extraShots > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  {(item.addOns ?? []).length > 0 && (
                    <p className="text-[10px] text-greek-500 mt-1">
                      + {(item.addOns ?? []).join(", ")}
                    </p>
                  )}
                  {item.specialInstructions && (
                    <p className="text-[10px] text-greek-400 italic mt-0.5">
                      &quot;{item.specialInstructions}&quot;
                    </p>
                  )}
                </div>
                <span className="text-sm font-medium text-greek-800 ml-2">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t-2 border-greek-200 pt-3 flex justify-between items-center">
          <span className="font-display font-bold text-greek-800">Total</span>
          <span className="font-display font-bold text-lg text-greek-800">
            {formatPrice(order.totalPrice)}
          </span>
        </div>

        <p className="text-center text-xs text-greek-400 mt-4">
          Thank you for visiting Aegean Brew!
        </p>
      </div>
    </div>
  );
}
