import React, { useState, useEffect } from "react";
import { ShoppingCart, Smartphone, Zap } from "lucide-react";
import { FaApple, FaAndroid, FaMobile } from 'react-icons/fa';

const FuturisticProductCard = ({
  img = "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
  phones = {
    iPhone: 140,
    Android: 120,
  },
}) => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState(0);
  const [isFloating, setIsFloating] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setIsFloating(prev => !prev), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBrandSelect = (b) => {
    setBrand(b);
    setModel("");
    setPrice(phones[b] || 0);
    setDropdownOpen(false);
  };

  const handleModelChange = (e) => setModel(e.target.value);

  const addToCart = async () => {
    if (!brand || !model.trim()) return;
    setIsAddingToCart(true);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newItem = {
      id: Date.now(),
      name: model.trim(),
      brand,
      price,
      image: img,
      type: brand || "No type", // 👈 هنا أضفنا الـ type
      quantity: 1,
    };
    cart.push(newItem);
localStorage.setItem("cart", JSON.stringify(cart));

// حدث مخصص لتحديث الهيدر
window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart.length }));
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAddingToCart(false);
    setBrand(""); setModel(""); setPrice(0);
  };

  const isAddToCartDisabled = !brand || !model.trim() || isAddingToCart;
  const getBrandIcon = (b) => {
    switch(b) {
      case "iPhone": return <FaApple className="inline-block mr-2 text-yellow-400" />;
      case "Android": return <FaAndroid className="inline-block mr-2 text-fuchsia-400" />;
      default: return <FaMobile className="inline-block mr-2 text-purple-400" />;
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto font-sans">
      {/* Animated background glow */}
      {/* <div className="absolute -inset-4 bg-gradient-to-r from-purple-900 via-fuchsia-500/30 to-yellow-500/20 rounded-3xl blur-xl opacity-75 animate-pulse"></div> */}

      <div className="relative group">
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-black/90 to-gray-900/80 rounded-3xl border border-white overflow-hidden">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/50 via-fuchsia-400/40 to-yellow-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-purple-950/60 via-fuchsia-900/50 to-yellow-900/30"></div>

          <div className="relative z-10 p-6">
            {/* Product image */}
            <div className="relative mb-8 flex justify-center">
              <div className={`relative transition-transform duration-3000 ease-in-out ${isFloating ? "translate-y-0" : "-translate-y-2"}`}>
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-black/70 border border-fuchsia-400/40 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-400/20 via-transparent to-yellow-400/20 rounded-2xl"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-yellow-400/30 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img src={img} alt="Product" loading="lazy" className="relative z-10 w-full h-full object-cover rounded-2xl"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl"></div>
                </div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-fuchsia-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-50" style={{ animationDelay: "1s" }}></div>
              </div>
            </div>

            {/* Brand Dropdown */}
            <div className="space-y-4 mb-4 relative">
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fuchsia-400 w-4 h-4 z-10" />
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full text-left pl-10 pr-10 py-4 rounded-xl bg-gray-900/60 backdrop-blur-sm text-white border border-gray-600/50 flex items-center justify-between"
                >
                  <span>{brand ? <>{getBrandIcon(brand)} {brand}</> : "Select Device Brand"}</span>
                  <span className="rotate-45 inline-block border-r-2 border-b-2 border-yellow-400 w-3 h-3 transform"></span>
                </button>

                {dropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-gray-900 text-white rounded-xl border border-gray-600/50 max-h-60 overflow-auto shadow-lg">
                    {Object.keys(phones).map((b) => (
                      <li key={b} onClick={() => handleBrandSelect(b)} className="px-4 py-3 hover:bg-purple-500/30 cursor-pointer flex items-center">
                        {getBrandIcon(b)} {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Model input */}
              {brand && (
                <div className="relative animate-fadeIn">
                  <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 w-4 h-4 z-10" />
                  <input
                    type="text"
                    value={model}
                    onChange={handleModelChange}
                    placeholder={`Enter your ${brand} model...`}
                    className="w-full pl-10 pr-4 py-4 rounded-xl bg-gray-900/60 text-white border border-gray-600/50 focus:border-fuchsia-500 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-fuchsia-500/20 placeholder-gray-400"
                  />
                </div>
              )}
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                {price > 0 && <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-yellow-400/30 blur-lg rounded-lg animate-pulse"></div>}
                <span className="relative text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-yellow-400 bg-clip-text drop-shadow-2xl tracking-wider">
                  {price > 0 ? `${price} EGP` : "—"}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={addToCart}
              disabled={isAddToCartDisabled}
              className={`relative w-full group overflow-hidden rounded-2xl bg-yellow-600 p-[2px] transition-all duration-300 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed ${isAddingToCart ? 'animate-pulse' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow"></div>
              <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl px-6 py-4 transition-all duration-300">
                <div className="relative flex items-center justify-center gap-3 text-white font-bold text-lg">
                  {isAddingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" />
                      <span>{brand && model.trim() ? "Add to Cart" : "Select Configuration"}</span>
                    </>
                  )}
                </div>
              </div>
            </button>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default FuturisticProductCard;
