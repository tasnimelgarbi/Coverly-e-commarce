import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logonav.png";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";

const Navbar = ({ mobile }) => {
  const navbar = [
    { title: "الرئيسية", link: "#home" },
    { title: "المنتجات", link: "#categories" },
    { title: "آراء العملاء", link: "#feedbacks" },
    { title: "اتصل بنا", link: "#footer" },
  ];

  return (
    <ul className={`${mobile ? "grid grid-cols-2 gap-2 w-full px-2 py-2 backdrop-blur-md rounded-2xl " : "flex gap-8 ml-16 mx-auto items-center"}`}>
      {navbar.map((item, index) => (
        <li key={index} className="flex items-center justify-center">
        {item.link.startsWith("#") ? (
  <button
    onClick={() => {
      const section = document.querySelector(item.link);
      section?.scrollIntoView({ behavior: "smooth" });
    }}
    className={`cursor-pointer text-lg text-yellow-300 font-bold py-2 px-5 rounded-[35px_45px_35px_45px] shadow-[inset_6px_6px_5px_rgba(0,0,0,0.6),inset_-2px_-2px_10px_rgba(255,255,255,0.25)] transition ${mobile ? "w-full text-center" : "whitespace-nowrap"}`}
  >
    {item.title}
  </button>
) : (
  <Link
    to={item.link}
    className={`cursor-pointer text-lg text-yellow-300 font-bold py-2 px-5 rounded-[35px_45px_35px_45px] shadow-[inset_6px_6px_5px_rgba(0,0,0,0.6),inset_-2px_-2px_10px_rgba(255,255,255,0.25)] transition ${mobile ? "w-full text-center" : "whitespace-nowrap"}`}
  >
    {item.title}
  </Link>
)}

        </li>
      ))}
    </ul>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
  const updateCount = (e) => {
    // لو فيه detail جاي من الحدث استخدمه، وإلا اقرأ من localStorage
    if(e?.detail) {
      setCartCount(e.detail);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    }
  };
  // تحديث أول مرة
  updateCount();
  // سماع للتغييرات
  window.addEventListener("storage", updateCount);
  window.addEventListener("cartUpdated", updateCount);

  return () => {
    window.removeEventListener("storage", updateCount);
    window.removeEventListener("cartUpdated", updateCount);
  };
}, []);


  return (
    <header className=" fixed top-0 left-0 w-full z-50 backdrop-blur-xs shadow-lg transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5 gap-10">

        {/* Logo */}
        <div className="flex items-center flex-1">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-11 w-auto" />
            <span className="text-yellow-300 font-bold text-3xl">Coverly</span>
          </Link>
        </div>

        {/* Navbar on large screens */}
        {location.pathname !== "/cart" && (
          <div className=" hidden lg:flex flex-1 justify-center">
            <Navbar />
          </div>
        )}

        {/* Right section */}
        <div className="mr-5 flex items-center justify-end flex-1 gap-6">

          {/* Hamburger menu on Home only */}
          {location.pathname === "/" && (
            <button
              className="lg:hidden text-yellow-300 text-3xl"
              onClick={() => setOpen(!open)}
            >
              {open ? <FiX /> : <FiMenu />}
            </button>
          )}

          {/* Cart icon (hidden on /cart) */}
          {location.pathname !== "/cart" ? (
            <Link to="/cart" className="relative cursor-pointer">
              <FiShoppingCart className="text-2xl text-yellow-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">{cartCount}</span>
              )}
            </Link>
          ) : (
            // Products button shown on /cart page
            <Link to="/#categories" className="bg-yellow-300 text-black font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform">
              المنتجات
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      {open && (
        <div className="lg:hidden px-4 pb-2">
          <Navbar mobile />
        </div>
      )}
    </header>
  );
};

export default Header;
