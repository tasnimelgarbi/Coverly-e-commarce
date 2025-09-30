import React, { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 200);
  };

  return (
    <div className={`mt-10 group relative overflow-hidden bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300 ${isRemoving ? 'scale-95 opacity-50' : 'hover:scale-[1.02]'}`}>
      
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-pink-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Product Image & Info */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative">
            <img
              src={item.image || "/images/placeholder.png"}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-2xl border-2 border-purple-200 shadow-md group-hover:shadow-lg transition-all duration-300"
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {item.quantity}
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
              {item.name}
            </h3>
            {item.brand && (
              <p className="text-sm text-gray-500 font-medium">
                {item.brand} {item.model}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-purple-600">{item.price}</span>
              <span className="text-sm text-gray-500 font-medium">EGP</span>
            </div>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1 bg-white rounded-2xl p-1 shadow-md border border-purple-100">
            <button
              onClick={() => onDecrease(item.id)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-bold text-gray-700 text-lg">
              {item.quantity}
            </span>
            <button
              onClick={() => onIncrease(item.id)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors duration-200 hover:scale-105"
          >
            <Trash2 size={14} />
            Remove
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[120px] bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
          <p className="text-sm text-gray-500 font-medium mb-1">Subtotal</p>
          <div className="flex items-center justify-end gap-1">
            <span className="text-2xl font-bold text-purple-600">
              {Number(item.price) * Number(item.quantity)}
            </span>
            <span className="text-sm text-gray-500 font-medium">EGP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
