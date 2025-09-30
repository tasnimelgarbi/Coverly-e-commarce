import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import Order from "./Order";
import Header from "../header/Header";

export default function Cart() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increase = (id) =>
    setCart((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, quantity: it.quantity + 1 } : it
      )
    );

  const decrease = (id) =>
    setCart((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it
        )
        .filter(Boolean)
    );

  const removeItem = (id) =>
    setCart((prev) => prev.filter((it) => it.id !== id));

  const total = cart.reduce(
    (acc, it) => acc + Number(it.price) * Number(it.quantity),
    0
  );

  const handleOrderPlaced = (order) => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
    console.log("order saved:", order);
    alert("Order placed successfully!");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4 sm:p-6 relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="mt-25 inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-3xl px-6 py-3 mb-4">
              <h1 className="text-2xl font-bold text-white">Your Shopping Cart</h1>
            </div>
            <p className="text-purple-200">Review your items and complete your order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/20">
                  <p className="text-xl text-white font-semibold mb-2">Your cart is empty</p>
                  <p className="text-purple-200">Add some items to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={item.id}
                      style={{ animationDelay: `${index * 100}ms` }}
                      className="animate-in slide-in-from-bottom-4 duration-500"
                    >
                      <CartItem
                        item={item}
                        onIncrease={increase}
                        onDecrease={decrease}
                        onRemove={removeItem}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white mb-4">
                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-4">
                <div className="text-center">
                  <p className="text-purple-200 mb-2">Total Amount</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-white">{total}</span>
                    <span className="text-purple-200">EGP</span>
                  </div>
                </div>
              </div>

              <Order cart={cart} total={total} onPlaceOrder={handleOrderPlaced} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
