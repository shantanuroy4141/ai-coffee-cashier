"use client";

import { menuItems, addOns, categories, formatPrice } from "@/lib/menu";
import { useState } from "react";

export default function MenuSidebar() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const drinks = filteredItems.filter((item) => !item.isPastry);
  const pastries = filteredItems.filter((item) => item.isPastry);

  return (
    <div className="w-80 flex-shrink-0 bg-white border-r border-santorini-100 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-santorini-100 bg-gradient-to-r from-santorini-50/80 to-white">
        <h2 className="font-display text-lg font-bold text-santorini-800">
          Our Menu
        </h2>
      </div>

      {/* Category Filter */}
      <div className="px-3 py-2.5 border-b border-santorini-100 flex gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeCategory === "all"
              ? "bg-santorini-500 text-white"
              : "bg-santorini-50 text-santorini-700 hover:bg-santorini-100"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-santorini-500 text-white"
                : "bg-santorini-50 text-santorini-700 hover:bg-santorini-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Menu - Drinks & Pastries (scrollable, prioritized) */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {drinks.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-santorini-50/80 text-santorini-700 uppercase tracking-wider text-[10px] font-semibold">
                <th className="text-left py-2 px-3 font-semibold">Drink</th>
                <th className="text-right py-2 px-2 font-semibold w-16">12oz</th>
                <th className="text-right py-2 px-3 font-semibold w-16">16oz</th>
              </tr>
            </thead>
            <tbody>
              {drinks.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-santorini-100/60 transition-colors hover:bg-santorini-50/40"
                >
                  <td className="py-2 px-3 align-top">
                    <div>
                      <span className="font-semibold text-santorini-900 block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-santorini-600/80 line-clamp-1">
                        {item.description}
                      </span>
                      {(item.canBeHot || item.canBeCold || !item.caffeinated) && (
                        <span className="text-[10px] text-santorini-500/70 mt-0.5 inline-block">
                          {[item.canBeHot && "hot", item.canBeCold && "iced", !item.caffeinated && "decaf"]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right text-santorini-800 tabular-nums align-top font-medium">
                    {formatPrice(item.prices.S)}
                  </td>
                  <td className="py-2 px-2 pr-3 text-right text-santorini-800 tabular-nums align-top font-medium">
                    {formatPrice(item.prices.L)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {pastries.length > 0 && (
          <div className="mt-4">
            <div className="px-3 py-1.5">
              <h3 className="font-semibold text-[10px] text-santorini-600 uppercase tracking-wider">
                Pastry
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-santorini-50/80 text-santorini-700 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="text-left py-2 px-3 font-semibold">Item</th>
                  <th className="text-right py-2 px-3 font-semibold w-16">Price</th>
                </tr>
              </thead>
              <tbody>
                {pastries.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-santorini-100/60 hover:bg-santorini-50/40"
                  >
                    <td className="py-2 px-3">
                      <span className="font-semibold text-santorini-900 block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-santorini-600/80">
                        {item.description}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-santorini-800 tabular-nums font-medium">
                      {formatPrice(item.prices.S)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add-ons - Compact table, options left, prices right */}
      <div className="flex-shrink-0 border-t border-santorini-100 bg-santorini-50/50">
        <div className="px-3 py-1.5">
          <h3 className="font-semibold text-[10px] text-santorini-600 uppercase tracking-wider">
            Add-ons
          </h3>
        </div>
        <table className="w-full text-[11px]">
          <tbody>
            {addOns.map((addon) => (
              <tr
                key={addon.id}
                className="border-b border-santorini-100/50 last:border-b-0 hover:bg-santorini-50/60"
              >
                <td className="py-1.5 px-3 text-santorini-800 font-medium">
                  {addon.name}
                </td>
                <td className="py-1.5 px-3 text-right text-santorini-700 tabular-nums">
                  {addon.price === 0 ? "no charge" : `+${formatPrice(addon.price)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
