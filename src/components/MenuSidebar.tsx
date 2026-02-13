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
    <div className="w-80 min-w-0 bg-white border-r border-greek-100 flex flex-col h-full overflow-hidden shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-greek-100">
        <h2 className="font-display text-lg font-bold text-greek-800">
          Our Menu
        </h2>
        <p className="text-xs text-greek-500 mt-0.5">
          Sizes: S (12oz) · L (16oz)
        </p>
      </div>

      {/* Category Filter */}
      <div className="px-3 py-2.5 border-b border-greek-100 flex gap-1.5 flex-wrap">
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

      {/* Menu Table */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-greek-50/80 text-greek-600 uppercase tracking-wider text-[10px] font-semibold">
              <th className="text-left py-2.5 px-3 font-semibold">Item</th>
              <th className="text-right py-2.5 px-3 font-semibold w-20">S</th>
              <th className="text-right py-2.5 px-3 font-semibold w-20 pr-3">L</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems
              .filter((item) => !item.isPastry)
              .map((item, idx) => (
                <tr
                  key={item.id}
                  className={`border-b border-greek-100/60 transition-colors hover:bg-greek-50/40 ${
                    idx % 2 === 1 ? "bg-greek-50/20" : "bg-white"
                  }`}
                >
                  <td className="py-2.5 px-3 align-top">
                    <div>
                      <span className="font-medium text-greek-900">{item.name}</span>
                      <p className="text-xs text-greek-500 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                      {(item.canBeHot || item.canBeCold || !item.caffeinated) && (
                        <span className="text-[10px] text-greek-400 mt-1 inline-block">
                          {[item.canBeHot && "Hot", item.canBeCold && "Iced", !item.caffeinated && "Decaf"]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right text-greek-700 tabular-nums align-top">
                    {formatPrice(item.prices.S)}
                  </td>
                  <td className="py-2.5 px-2 pr-3 text-right text-greek-700 tabular-nums align-top">
                    {formatPrice(item.prices.L)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {filteredItems.some((item) => item.isPastry) && (
          <>
            <div className="px-3 py-2 bg-greek-50/80 mt-2">
              <h3 className="font-semibold text-[10px] text-greek-600 uppercase tracking-wider">
                Pastry
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-greek-50/80 text-greek-600 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="text-left py-2.5 px-3 font-semibold">Item</th>
                  <th className="text-right py-2.5 px-3 font-semibold w-20 pr-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems
                  .filter((item) => item.isPastry)
                  .map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`border-b border-greek-100/60 ${
                        idx % 2 === 1 ? "bg-greek-50/20" : "bg-white"
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-greek-900">{item.name}</span>
                        <p className="text-xs text-greek-500 mt-0.5">{item.description}</p>
                      </td>
                      <td className="py-2.5 px-3 text-right text-greek-700 tabular-nums">
                        {formatPrice(item.prices.S)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Add-ons Table */}
      <div className="border-t border-greek-100">
        <div className="px-3 py-2 bg-greek-50/80">
          <h3 className="font-semibold text-[10px] text-greek-600 uppercase tracking-wider">
            Add-ons
          </h3>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {addOns.map((addon, idx) => (
              <tr
                key={addon.id}
                className={`border-b border-greek-100/60 last:border-b-0 ${
                  idx % 2 === 1 ? "bg-greek-50/20" : "bg-white"
                }`}
              >
                <td className="py-2 px-3 text-greek-700 font-medium">
                  {addon.name}
                </td>
                <td className="py-2 px-3 text-right text-greek-600 tabular-nums">
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
