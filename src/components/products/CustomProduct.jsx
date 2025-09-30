import React, { useState, useRef, useEffect } from "react";
import { ShoppingCart, Smartphone, Zap } from "lucide-react";
import { FaApple, FaAndroid, FaMobile } from 'react-icons/fa';

const CustomProductCard = () => {
  const [selected, setSelected] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isFloating, setIsFloating] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fileInputRef = useRef(null);

  const productTypes = {
    iPhone: 140,
    Android: 120,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFloating(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBrandSelect = (brand) => {
    setSelected(brand);
    setCustomInput("");
    setDropdownOpen(false);
  };

  const handleModelChange = (e) => {
    setCustomInput(e.target.value);
  };

  const handleAddToCart = async () => {
    if (!selected || !customInput.trim() || !image) return;

    setIsAddingToCart(true);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newItem = {
      id: Date.now(),
      name: customInput.trim(),
      brand: selected,
      // model: ,
      price: productTypes[selected] || 0,
      image: preview,
      quantity: 1,
    };

    cart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    // حدث مخصص لتحديث Navbar فورًا
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart.length }));

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAddingToCart(false);
    setSelected("");
    setCustomInput("");
    setImage(null);
    setPreview(null);
  };

  const isAddToCartDisabled = !selected || !customInput.trim() || !image || isAddingToCart;

  const getBrandIcon = (brand) => {
    switch(brand) {
      case "iPhone": return <FaApple className="inline-block mr-2 text-yellow-400" />;
      case "Android": return <FaAndroid className="inline-block mr-2 text-fuchsia-400" />;
      default: return <FaMobile className="inline-block mr-2 text-purple-400" />;
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto font-sans">
      {/* Animated background glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-900 via-fuchsia-500/30 to-yellow-500/20 rounded-3xl blur-xl opacity-75 animate-pulse"></div>

      <div className="relative group">
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-black/90 to-gray-900/80 rounded-3xl border border-white shadow-2xl overflow-hidden transform transition-all duration-700 ">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/50 via-fuchsia-400/40 to-yellow-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-purple-950/60 via-fuchsia-900/50 to-yellow-900/30"></div>

          <div className="relative z-10 p-6">
            {/* Product image */}
            <div className="relative mb-8 flex justify-center">
              <div className={`relative transition-transform duration-3000 ease-in-out ${isFloating ? "translate-y-0" : "-translate-y-2"}`}>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="relative w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-black/70 border border-fuchsia-400/40 shadow-2xl cursor-pointer"
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white">
                      <p className="text-yellow-400 text-sm font-medium mb-2">Click to upload</p>
                      <h2 className="text-base font-semibold">Custom Case</h2>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

            {/* Brand Dropdown */}
            <div className="space-y-4 mb-4 relative">
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fuchsia-400 w-4 h-4 z-10" />
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full text-left pl-10 pr-10 py-4 rounded-xl bg-gray-900/60 text-white border flex items-center justify-between"
                >
                  <span>{selected ? <>{getBrandIcon(selected)} {selected}</> : "Select Device Brand"}</span>
                  <span className="rotate-45 inline-block border-r-2 border-b-2 border-yellow-400 w-3 h-3 transform"></span>
                </button>

                {dropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-gray-900 text-white rounded-xl border max-h-60 overflow-auto shadow-lg">
                    {Object.keys(productTypes).map((brand) => (
                      <li key={brand} onClick={() => handleBrandSelect(brand)} className="px-4 py-3 hover:bg-purple-500/30 cursor-pointer flex items-center">
                        {getBrandIcon(brand)} {brand}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Model input */}
              {selected && (
                <div className="relative animate-fadeIn">
                  <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 w-4 h-4 z-10" />
                  <input
                    type="text"
                    value={customInput}
                    onChange={handleModelChange}
                    placeholder={`Enter your ${selected} model...`}
                    className="w-full pl-10 pr-4 py-4 rounded-xl bg-gray-900/60 text-white border focus:border-fuchsia-500 transition-all duration-300 placeholder-gray-400"
                  />
                </div>
              )}
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-yellow-400">
                {selected ? `${productTypes[selected]} EGP` : "—"}
              </span>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
              className={`relative w-full overflow-hidden rounded-2xl bg-yellow-600 p-[2px] transition-all duration-300 hover:scale-105 disabled:bg-gray-600 ${isAddingToCart ? 'animate-pulse' : ''}`}
            >
              <div className="relative bg-yellow-400 rounded-2xl px-6 py-4 flex items-center justify-center gap-3 text-white font-bold text-lg">
                {isAddingToCart ? "Adding..." : "Add to Cart"}
                <ShoppingCart className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomProductCard;
