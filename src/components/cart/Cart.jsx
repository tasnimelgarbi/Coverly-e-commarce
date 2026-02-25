import React, { useEffect, useState, useCallback } from "react";
import CartItem from "./CartItem";
import Order from "./Order";
import Header from "../header/Header";

export default function Cart() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  // ✅ NEW: Sync cart from localStorage on events
  const syncCart = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(Array.isArray(saved) ? saved : []);
    } catch {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    // أول مرة (لو فتحت صفحة السلة)
    syncCart();

    const onCartUpdated = () => syncCart();
    const onStorage = () => syncCart();

    window.addEventListener("cartUpdated", onCartUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("cartUpdated", onCartUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [syncCart]);

  // ✅ زي ما كان: أي تغيير في cart جوه صفحة السلة يتكتب
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increase = (id) =>
    setCart((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: it.quantity + 1 } : it))
    );

  const decrease = (id) =>
    setCart((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it
        )
        .filter(Boolean)
    );

  const removeItem = (id) => setCart((prev) => prev.filter((it) => it.id !== id));

  const total = cart.reduce(
    (acc, it) => acc + Number(it.price) * Number(it.quantity),
    0
  );

  const handleOrderPlaced = (order) => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));

    // ✅ optional: حدث تحديث (لو في هيدر/بادج بيعرض عدد السلة)
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: [] }));

    console.log("order saved:", order);
  };

  return (
    <>
      <Header />
      <div
        dir="rtl"
        className="pt-20 min-h-screen  bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4 sm:p-6 relative"
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-3xl px-6 py-3 mb-4 border border-white/15">
              <h1 className="text-2xl font-extrabold text-white">سلة التسوق</h1>
            </div>
            <p className="text-purple-200 font-semibold">
              راجع منتجاتك وأكمل الطلب بكل سهولة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/20">
                  <p className="text-xl text-white font-extrabold mb-2">
                    سلة التسوق فارغة
                  </p>
                  <p className="text-purple-200 font-semibold">
                    أضف بعض المنتجات للبدء
                  </p>
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
                <h2 className="text-xl font-extrabold">ملخص الطلب</h2>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-4">
                <div className="text-center">
                  <p className="text-purple-200 mb-2 font-semibold">الإجمالي</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-purple-200 font-semibold">جنيه</span>
                    <span className="text-3xl font-extrabold text-white">
                      {total}
                    </span>
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