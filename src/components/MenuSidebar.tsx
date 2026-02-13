"use client";

import { menuItems, addOns, categories, formatPrice } from "@/lib/menu";
import { useState } from "react";

export default function MenuSidebar() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="w-80 bg-white border-r border-greek-100 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-greek-100 bg-gradient-to-r from-greek-50 to-white">
        <h2 className="font-display text-lg font-bold text-greek-800">
          Our Menu
        </h2>
        <p className="text-xs text-greek-500 mt-0.5">
          Sizes: S (8oz) &middot; M (12oz) &middot; L (16oz)
        </p>
      </div>

      {/* Category Filter */}
      <div className="p-3 border-b border-greek-50 flex gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeCategory === "all"
              ? "bg-greek-500 text-white"
              : "bg-greek-50 text-greek-600 hover:bg-greek-100"
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
                ? "bg-greek-500 text-white"
                : "bg-greek-50 text-greek-600 hover:bg-greek-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-2xl bg-greek-50/50 hover:bg-greek-50 transition-colors border border-greek-100/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-greek-900">
                  {item.name}
                </h3>
                <p className="text-xs text-greek-500 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex gap-2 text-xs">
                <span className="bg-white px-2 py-0.5 rounded-lg text-greek-700 border border-greek-100">
                  S {formatPrice(item.prices.S)}
                </span>
                <span className="bg-white px-2 py-0.5 rounded-lg text-greek-700 border border-greek-100">
                  M {formatPrice(item.prices.M)}
                </span>
                <span className="bg-white px-2 py-0.5 rounded-lg text-greek-700 border border-greek-100">
                  L {formatPrice(item.prices.L)}
                </span>
              </div>
            </div>
            <div className="flex gap-1 mt-2">
              {item.canBeHot && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-100">
                  Hot
                </span>
              )}
              {item.canBeCold && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                  Iced
                </span>
              )}
              {!item.caffeinated && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-green-50 text-green-600 border border-green-100">
                  Caffeine-free
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add-ons Section */}
      <div className="border-t border-greek-100 p-3 bg-greek-50/30">
        <h3 className="font-semibold text-xs text-greek-700 mb-2 uppercase tracking-wider">
          Add-ons
        </h3>
        <div className="grid grid-cols-2 gap-1">
          {addOns.map((addon) => (
            <div
              key={addon.id}
              className="text-xs text-greek-600 flex justify-between bg-white rounded-lg px-2 py-1 border border-greek-100/50"
            >
              <span className="truncate">{addon.name}</span>
              <span className="text-greek-500 ml-1 shrink-0">
                +{formatPrice(addon.price)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
