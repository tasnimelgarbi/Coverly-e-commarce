import React, { useState } from "react";
import { Minus, Plus, Trash2, Smartphone } from "lucide-react";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 200);
  };

  const subtotal = Number(item.price) * Number(item.quantity);

  return (
    <div
      dir="rtl"
      className={`mt-6 group relative overflow-hidden rounded-3xl p-5 sm:p-6
        border border-white/15 bg-white/10 backdrop-blur-xl
        shadow-[0_18px_55px_-35px_rgba(0,0,0,0.85)]
        transition-all duration-300
        ${isRemoving ? "scale-[0.98] opacity-60" : "hover:scale-[1.01] hover:border-white/25"}
      `}
    >
      {/* Glass glow + “case” vibe */}
      <div className="pointer-events-none absolute -inset-16 opacity-70 blur-3xl bg-gradient-to-r from-yellow-300/10 via-purple-500/14 to-pink-500/12" />
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 via-transparent to-white/5" />

      {/* Subtle diagonal pattern like phone case texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 10px)",
        }}
      />

      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Product Image & Info */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative">
            {/* Phone frame */}
            <div className="absolute -inset-2 rounded-[28px] border border-white/15 bg-white/5 backdrop-blur-md" />
            <div className="relative w-24 h-24 rounded-[22px] overflow-hidden">
              <img
                src={item.image || "/images/placeholder.png"}
                alt={item.name}
                className="w-full h-full object-cover scale-[1.02] transition-transform duration-500 group-hover:scale-[1.08]"
                loading="lazy"
                decoding="async"
              />
              {/* shine */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20" />
            </div>

            {/* Quantity badge */}
            <div className="absolute -top-2 -left-2 flex items-center gap-1 rounded-full border border-white/15 bg-black/30 backdrop-blur px-2 py-1 text-[11px] font-extrabold text-white">
              <Smartphone size={12} className="opacity-90" />
              {item.quantity}
            </div>
          </div>

          <div className="text-right min-w-0">
            <h3 className="truncate text-lg font-extrabold text-white">
              {item.name}
            </h3>

            {item.brand && (
              <p className="mt-1 text-sm font-semibold text-white/65">
                {item.brand} {item.model}
              </p>
            )}

            <div className="mt-2 flex items-center justify-end gap-2">
              <span className="text-xs font-bold text-white/60">جنيه</span>
              <span className="text-lg font-extrabold text-yellow-200">
                {item.price}
              </span>
            </div>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1 rounded-2xl p-1 border border-white/15 bg-white/10 backdrop-blur shadow-sm">
            <button
              onClick={() => onDecrease(item.id)}
              className="w-10 h-10 flex items-center justify-center rounded-xl
                bg-gradient-to-r from-purple-500 to-pink-500
                hover:from-purple-600 hover:to-pink-600 text-white
                transition-all duration-200 hover:scale-105 active:scale-95
                shadow-[0_10px_25px_-12px_rgba(236,72,153,0.8)]
              "
              aria-label="تقليل الكمية"
              title="تقليل الكمية"
            >
              <Minus size={16} />
            </button>

            <span className="w-12 text-center font-extrabold text-white text-lg tabular-nums">
              {item.quantity}
            </span>

            <button
              onClick={() => onIncrease(item.id)}
              className="w-10 h-10 flex items-center justify-center rounded-xl
                bg-gradient-to-r from-purple-500 to-pink-500
                hover:from-purple-600 hover:to-pink-600 text-white
                transition-all duration-200 hover:scale-105 active:scale-95
                shadow-[0_10px_25px_-12px_rgba(168,85,247,0.8)]
              "
              aria-label="زيادة الكمية"
              title="زيادة الكمية"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="group/remove inline-flex items-center gap-2 rounded-full
              border border-white/10 bg-white/5 backdrop-blur
              px-3 py-1.5 text-xs font-extrabold text-white/70
              hover:text-red-200 hover:border-red-300/20 hover:bg-red-500/10
              transition-all duration-200 active:scale-[0.99]
            "
            aria-label="حذف المنتج"
            title="حذف المنتج"
          >
            <Trash2 size={14} className="opacity-90" />
            حذف
          </button>
        </div>

        {/* Subtotal */}
        <div className="w-full sm:w-auto min-w-[170px] rounded-2xl p-4 text-right
          border border-white/15 bg-white/10 backdrop-blur
        ">
          <p className="text-xs font-bold text-white/60 mb-1">الإجمالي الفرعي:</p>

          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-white/60">جنيه</span>
            <span className="text-2xl font-extrabold text-yellow-200 tabular-nums">
              {subtotal}
            </span>
          </div>

          {/* tiny hint bar like “case protection level” */}
         

        </div>
      </div>
    </div>
  );
}